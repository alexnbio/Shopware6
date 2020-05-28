<?php declare(strict_types=1);

namespace Kiener\MolliePayments\Handler;

use Exception;
use Kiener\MolliePayments\Helper\PaymentStatusHelper;
use Kiener\MolliePayments\Service\CustomerService;
use Kiener\MolliePayments\Service\CustomFieldService;
use Kiener\MolliePayments\Service\LoggerService;
use Kiener\MolliePayments\Service\OrderService;
use Kiener\MolliePayments\Service\SettingsService;
use Kiener\MolliePayments\Setting\MollieSettingStruct;
use Mollie\Api\Exceptions\ApiException;
use Mollie\Api\MollieApiClient;
use Mollie\Api\Resources\Order;
use Mollie\Api\Resources\OrderLine;
use Mollie\Api\Types\PaymentMethod;
use Mollie\Api\Types\PaymentStatus;
use Monolog\Logger;
use RuntimeException;
use Shopware\Core\Checkout\Cart\Price\Struct\CartPrice;
use Shopware\Core\Checkout\Customer\CustomerEntity;
use Shopware\Core\Checkout\Order\Aggregate\OrderTransaction\OrderTransactionStateHandler;
use Shopware\Core\Checkout\Payment\Cart\AsyncPaymentTransactionStruct;
use Shopware\Core\Checkout\Payment\Cart\PaymentHandler\AsynchronousPaymentHandlerInterface;
use Shopware\Core\Checkout\Payment\Exception\CustomerCanceledAsyncPaymentException;
use Shopware\Core\Framework\DataAbstractionLayer\Exception\InconsistentCriteriaIdsException;
use Shopware\Core\Framework\Language\LanguageEntity;
use Shopware\Core\Framework\Validation\DataBag\RequestDataBag;
use Shopware\Core\System\Currency\CurrencyEntity;
use Shopware\Core\System\Locale\LocaleEntity;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Shopware\Core\System\StateMachine\Exception\IllegalTransitionException;
use Shopware\Core\System\StateMachine\Exception\StateMachineInvalidEntityIdException;
use Shopware\Core\System\StateMachine\Exception\StateMachineInvalidStateFieldException;
use Shopware\Core\System\StateMachine\Exception\StateMachineNotFoundException;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RouterInterface;

class PaymentHandler implements AsynchronousPaymentHandlerInterface
{
    public const PAYMENT_METHOD_NAME = '';
    public const PAYMENT_METHOD_DESCRIPTION = '';

    protected const FIELD_AMOUNT = 'amount';
    protected const FIELD_REDIRECT_URL = 'redirectUrl';
    protected const FIELD_LOCALE = 'locale';
    protected const FIELD_METHOD = 'method';
    protected const FIELD_ORDER_NUMBER = 'orderNumber';
    protected const FIELD_LINES = 'lines';
    protected const FIELD_BILLING_ADDRESS = 'billingAddress';
    protected const FIELD_BILLING_EMAIL = 'billingEmail';
    protected const FIELD_SHIPPING_ADDRESS = 'shippingAddress';
    protected const FIELD_PAYMENT = 'payment';
    protected const FIELD_WEBHOOK_URL = 'webhookUrl';
    protected const FIELD_DUE_DATE = 'dueDate';
    protected const FIELD_EXPIRES_AT = 'expiresAt';
    protected const ENV_LOCAL_DEVELOPMENT = 'MOLLIE_LOCAL_DEVELOPMENT';

    /** @var string */
    protected $paymentMethod;

    /** @var array */
    protected $paymentMethodData = [];

    /** @var OrderTransactionStateHandler */
    protected $transactionStateHandler;

    /** @var OrderService */
    protected $orderService;

    /** @var CustomerService */
    protected $customerService;

    /** @var MollieApiClient */
    protected $apiClient;

    /** @var SettingsService */
    protected $settingsService;

    /** @var PaymentStatusHelper */
    protected $paymentStatusHelper;

    /** @var LoggerService */
    protected $logger;

    /** @var RouterInterface */
    protected $router;

    /** @var string $environment */
    protected $environment;

    /**
     * PaymentHandler constructor.
     *
     * @param OrderTransactionStateHandler $transactionStateHandler
     * @param OrderService                 $orderService
     * @param CustomerService              $customerService
     * @param MollieApiClient              $apiClient
     * @param SettingsService              $settingsService
     * @param PaymentStatusHelper          $paymentStatusHelper
     * @param LoggerService                $logger
     * @param RouterInterface              $router
     * @param string                       $environment
     */
    public function __construct(
        OrderTransactionStateHandler $transactionStateHandler,
        OrderService $orderService,
        CustomerService $customerService,
        MollieApiClient $apiClient,
        SettingsService $settingsService,
        PaymentStatusHelper $paymentStatusHelper,
        LoggerService $logger,
        RouterInterface $router,
        string $environment
    )
    {
        $this->transactionStateHandler = $transactionStateHandler;
        $this->orderService = $orderService;
        $this->customerService = $customerService;
        $this->apiClient = $apiClient;
        $this->paymentStatusHelper = $paymentStatusHelper;
        $this->logger = $logger;
        $this->router = $router;
        $this->settingsService = $settingsService;
        $this->environment = $environment;
    }

    /**
     * @param array               $orderData
     * @param SalesChannelContext $salesChannelContext
     * @param CustomerEntity      $customer
     * @param LocaleEntity        $locale
     *
     * @return array
     */
    protected function processPaymentMethodSpecificParameters(array $orderData, SalesChannelContext $salesChannelContext, CustomerEntity $customer, LocaleEntity $locale): array
    {
    }

    /**
     * The pay function will be called after the customer completed the order.
     * Allows to process the order and store additional information.
     *
     * A redirect to the url will be performed
     *
     * Throw a
     *
     * @param AsyncPaymentTransactionStruct $transaction
     * @param RequestDataBag                $dataBag
     * @param SalesChannelContext           $salesChannelContext
     *
     * @return RedirectResponse @see AsyncPaymentProcessException exception if an error ocurres while processing the
     *                          payment
     * @throws ApiException
     */
    public function pay(
        AsyncPaymentTransactionStruct $transaction,
        RequestDataBag $dataBag,
        SalesChannelContext $salesChannelContext
    ): RedirectResponse
    {
        /**
         * Set the API keys at Mollie based on the current context.
         */
        try {
            $this->setApiKeysBySalesChannelContext($salesChannelContext);
        } catch (Exception $e) {
            $this->logger->addEntry(
                $e->getMessage(),
                $salesChannelContext->getContext(),
                $e,
                [
                    'function' => 'payment-handler-set-api-keys'
                ]
            );
        }

        //ToDo: Data for specific payment methods vullen. Functie aanroepen die met specifieke payment methods overriden

        /**
         * Prepare the order for the Mollie Orders API and retrieve
         * a payment URL to redirect the customer to in order
         * to finish the payment.
         */
        try {
            $paymentUrl = $this->prepare($transaction, $salesChannelContext);
        } catch (Exception $e) {
            $this->logger->addEntry(
                $e->getMessage(),
                $salesChannelContext->getContext(),
                $e,
                [
                    'function' => 'order-prepare',
                ],
                Logger::ERROR
            );

            throw new RuntimeException(sprintf('Could not create a Mollie Payment Url, error: %s', $e->getMessage()));
        }

        // Set the payment status to in progress
        if (
            isset($paymentUrl)
            && !empty($paymentUrl)
            && method_exists($this->transactionStateHandler, 'process')
        ) {
            try {
                $this->transactionStateHandler->process(
                    $transaction->getOrderTransaction()->getId(),
                    $salesChannelContext->getContext()
                );
            } catch (Exception $e) {
                $this->logger->addEntry(
                    $e->getMessage(),
                    $salesChannelContext->getContext(),
                    $e,
                    [
                        'function' => 'payment-handler-set-transaction-state'
                    ]
                );
            }
        }

        /**
         * Redirect the customer to the payment URL. Afterwards the
         * customer is redirected back to Shopware's finish page, which
         * leads to the @finalize function.
         */
        return RedirectResponse::create($paymentUrl);
    }

    /**
     * The finalize function will be called when the user is redirected back to shop from the payment gateway.
     *
     * Throw a
     *
     * @param AsyncPaymentTransactionStruct $transaction
     * @param Request                       $request
     * @param SalesChannelContext           $salesChannelContext @see AsyncPaymentFinalizeException exception if an
     *                                                           error ocurres while calling an external payment API
     *                                                           Throw a @throws RuntimeException*@throws
     *                                                           CustomerCanceledAsyncPaymentException
     *
     * @throws CustomerCanceledAsyncPaymentException
     * @throws InconsistentCriteriaIdsException
     * @throws IllegalTransitionException
     * @throws StateMachineInvalidEntityIdException
     * @throws StateMachineInvalidStateFieldException
     * @throws StateMachineNotFoundException
     * @throws ApiException
     * @see CustomerCanceledAsyncPaymentException exception if the customer canceled the payment process on
     * payment provider page
     */
    public function finalize(AsyncPaymentTransactionStruct $transaction, Request $request, SalesChannelContext $salesChannelContext): void
    {
        /**
         * Retrieve the order from the transaction.
         */
        $order = $transaction->getOrder();

        /**
         * Retrieve the order's custom fields, or set an empty array.
         */
        $orderCustomFields = is_array($order->getCustomFields()) ? $order->getCustomFields() : [];

        /**
         * Retrieve the Mollie Order ID from the order custom fields. We use this
         * to fetch the order from Mollie's Order API and retrieve it's payment status.
         */
        $mollieOrderId = $orderCustomFields['mollie_payments']['order_id'] ?? null;

        if ($mollieOrderId === null) {
            // Set the error message
            $errorMessage = sprintf('The Mollie id for order %s could not be found', $order->getOrderNumber());

            // Log the error message in the database
            $this->logger->addEntry(
                $errorMessage,
                $salesChannelContext->getContext(),
                null,
                [
                    'function' => 'finalize-payment',
                ],
                Logger::ERROR
            );

            // Throw the error
            throw new RuntimeException($errorMessage);
        }

        /**
         * Set the API keys at Mollie based on the current context.
         */
        try {
            $this->setApiKeysBySalesChannelContext($salesChannelContext);
        } catch (Exception $e) {
            $this->logger->addEntry(
                $e->getMessage(),
                $salesChannelContext->getContext(),
                $e,
                [
                    'function' => 'payment-set-transaction-state'
                ]
            );
        }

        /**
         * Retrieve the order from Mollie's Orders API, so we can set the status of the order
         * and payment in Shopware.
         */
        try {
            $mollieOrder = $this->apiClient->orders->get($mollieOrderId, [
                'embed' => 'payments'
            ]);
        } catch (ApiException $e) {
            $this->logger->addEntry(
                $e->getMessage(),
                $salesChannelContext->getContext(),
                $e,
                [
                    'function' => 'get-mollie-order',
                ],
                Logger::ERROR
            );
        }

        /**
         * If the Mollie order can't be fetched, throw an error.
         */
        if (!isset($mollieOrder)) {
            throw new RuntimeException(
                'We can\'t fetch the order ' . $order->getOrderNumber() . ' (' . $mollieOrderId . ') from the Orders API'
            );
        }

        /**
         * Process the payment status of the order. Returns a PaymentStatus string which
         * we can use to throw an exception when the payment is cancelled.
         */
        try {
            $paymentStatus = $this->paymentStatusHelper->processPaymentStatus(
                $transaction->getOrderTransaction(),
                $order,
                $mollieOrder,
                $salesChannelContext->getContext()
            );
        } catch (Exception $e) {
            $this->logger->addEntry(
                $e->getMessage(),
                $salesChannelContext->getContext(),
                $e,
                [
                    'function' => 'finalize-payment',
                ],
                Logger::ERROR
            );
        }

        /**
         * If the payment was cancelled by the customer, throw an exception
         * to let the shop handle the cancellation.
         */
        if (
            isset($paymentStatus)
            && ($paymentStatus === PaymentStatus::STATUS_CANCELED || $paymentStatus === PaymentStatus::STATUS_FAILED)
        ) {
            try {
                $this->transactionStateHandler
                    ->reopen($transaction->getOrderTransaction()->getId(), $salesChannelContext->getContext());
            } catch (Exception $e) {
                $this->logger->addEntry(
                    $e->getMessage(),
                    $salesChannelContext->getContext(),
                    $e,
                    [
                        'function' => 'payment-handler-set-transaction-state'
                    ]
                );
            }

            throw new CustomerCanceledAsyncPaymentException(
                'Payment for order ' . $order->getOrderNumber() . ' (' . $mollieOrder->id . ') was cancelled by the customer.', ''
            );
        }
    }

    /**
     * Prepares the order payload to send to Mollie's Orders API. Create
     * an order based on this payload and retrieves a payment URL.
     *
     * @param AsyncPaymentTransactionStruct $transaction
     * @param SalesChannelContext           $salesChannelContext
     *
     * @return string|null
     */
    public function prepare(AsyncPaymentTransactionStruct $transaction, SalesChannelContext $salesChannelContext): ?string
    {
        /**
         * Retrieve the order from the order service in order to
         * get an enriched order entity. This is necessary to have
         * currency, locale and language available in the order entity.
         */
        $order = $this->orderService->getOrder($transaction->getOrder()->getId(), $salesChannelContext->getContext());
        $order = $order ?? $transaction->getOrder();

        /**
         * Retrieve the customer from the customer service in order to
         * get an enriched customer entity. This is necessary to have the
         * customer's addresses available in the customer entity.
         */
        if ($order->getOrderCustomer() !== null) {
            $customer = $this->customerService->getCustomer(
                $order->getOrderCustomer()->getCustomerId(),
                $salesChannelContext->getContext()
            );
        }

        /**
         * If no customer is stored on the order, fallback to the logged in
         * customer in the sales channel context.
         */
        if (!isset($customer) || $customer === null) {
            $customer = $salesChannelContext->getCustomer();
        }

        /**
         * If the customer isn't present, there is something wrong with the order.
         * Therefore we stop the process.
         */
        if ($customer === null) {
            return null;
        }

        /**
         * Retrieve currency information from the order. This information is
         * necessary for the payload data that is sent to Mollie's Orders API.
         *
         * If the order has no currency, we retrieve it from the sales channel context.
         *
         * @var CurrencyEntity $currency
         */
        $currency = $order->getCurrency();

        if ($currency === null) {
            $currency = $salesChannelContext->getCurrency();
        }

        /**
         * Retrieve locale information from the order. This information is
         * necessary for the payload data that is sent to Mollie's Orders API.
         *
         * Based on this information, Mollie tries to deliver a payment screen
         * in the customer's language.
         *
         * @var LanguageEntity $language
         * @var LocaleEntity   $locale
         */
        $locale = $order->getLanguage() !== null ? $order->getLanguage()->getLocale() : null;

        /**
         * Build an array of order data to send in the request
         * to Mollie's Orders API to create an order payment.
         */
        $orderData = [
            self::FIELD_AMOUNT => $this->orderService->getPriceArray(
                $currency !== null ? $currency->getIsoCode() : 'EUR',
                $order->getAmountTotal()
            ),
            self::FIELD_REDIRECT_URL => $this->router->generate('frontend.mollie.payment', [
                'transactionId' => $transaction->getOrderTransaction()->getId(),
            ], $this->router::ABSOLUTE_URL),
            self::FIELD_LOCALE => $locale !== null ? $locale->getCode() : null,
            self::FIELD_METHOD => $this->paymentMethod,
            self::FIELD_ORDER_NUMBER => $order->getOrderNumber(),
            self::FIELD_LINES => $this->orderService->getOrderLinesArray($order),
            self::FIELD_BILLING_ADDRESS => $this->customerService->getAddressArray(
                $customer->getDefaultBillingAddress(),
                $customer
            ),
            self::FIELD_SHIPPING_ADDRESS => $this->customerService->getAddressArray(
                $customer->getDefaultShippingAddress(),
                $customer
            ),
            self::FIELD_PAYMENT => []
        ];

        /**
         * Handle vat free orders.
         */
        if (
            in_array($transaction->getOrder()->getTaxStatus(), [
                    CartPrice::TAX_STATE_NET,
                    CartPrice::TAX_STATE_FREE
                ]
            , true)
        ) {
            $orderData[self::FIELD_AMOUNT] = $this->orderService->getPriceArray(
                $currency !== null ? $currency->getIsoCode() : 'EUR',
                $order->getAmountNet()
            );
        }

        /**
         * Try to fetch the Order Lifetime configuration. If it is can be fetched, set it expiresAt field
         * The expiresAt is optional and defaults to 28 days if not set
         *
         * @var MollieSettingStruct $settings
         */
        $settings = $this->settingsService->getSettings($salesChannelContext->getSalesChannel()->getId());

        try {
            $dueDate = $settings->getOrderLifetimeDate();

            if ($dueDate !== null) {
                $orderData[self::FIELD_EXPIRES_AT] = $dueDate;
            }
        } catch (Exception $e) {
            $this->logger->addEntry(
                $e->getMessage(),
                $salesChannelContext->getContext(),
                $e,
                [
                    'function' => 'finalize-payment',
                ],
                Logger::ERROR
            );
        }

        // Temporarily disabled due to errors with Paypal
        // $orderData = $this->processPaymentMethodSpecificParameters($orderData, $salesChannelContext, $customer, $locale);

        /**
         * Generate the URL for Mollie's webhook call only on prod environment. This webhook is used
         * to handle payment updates.
         */
        if (
            getenv(self::ENV_LOCAL_DEVELOPMENT) === false
            || (bool) getenv(self::ENV_LOCAL_DEVELOPMENT) === false
        ) {
            $orderData[self::FIELD_WEBHOOK_URL] = $this->router->generate('frontend.mollie.webhook', [
                'transactionId' => $transaction->getOrderTransaction()->getId()
            ], $this->router::ABSOLUTE_URL);
        }

        $customFields = $customer->getCustomFields();

        // @todo Handle credit card tokens from the Credit Card payment handler
        if (
            $this->paymentMethod === PaymentMethod::CREDITCARD
            && isset($customFields[CustomFieldService::CUSTOM_FIELDS_KEY_MOLLIE_PAYMENTS][CustomerService::CUSTOM_FIELDS_KEY_CREDIT_CARD_TOKEN])
            && (string)$customFields[CustomFieldService::CUSTOM_FIELDS_KEY_MOLLIE_PAYMENTS][CustomerService::CUSTOM_FIELDS_KEY_CREDIT_CARD_TOKEN] !== ''
        ) {
            $orderData['payment']['cardToken'] = $customFields[CustomFieldService::CUSTOM_FIELDS_KEY_MOLLIE_PAYMENTS][CustomerService::CUSTOM_FIELDS_KEY_CREDIT_CARD_TOKEN];
            $this->customerService->setCardToken($customer, '', $salesChannelContext->getContext());
        }

        // @todo Handle iDeal issuers from the iDeal payment handler
        if (
            $this->paymentMethod === PaymentMethod::IDEAL
            && isset($customFields[CustomFieldService::CUSTOM_FIELDS_KEY_MOLLIE_PAYMENTS][CustomerService::CUSTOM_FIELDS_KEY_PREFERRED_IDEAL_ISSUER])
            && (string)$customFields[CustomFieldService::CUSTOM_FIELDS_KEY_MOLLIE_PAYMENTS][CustomerService::CUSTOM_FIELDS_KEY_PREFERRED_IDEAL_ISSUER] !== ''
        ) {
            $orderData['payment']['issuer'] = $customFields[CustomFieldService::CUSTOM_FIELDS_KEY_MOLLIE_PAYMENTS][CustomerService::CUSTOM_FIELDS_KEY_PREFERRED_IDEAL_ISSUER];
        }

        $orderData = array_merge($orderData, $this->paymentMethodData);

        // Log the order data
        if ($settings->isDebugMode()) {
            $this->logger->addEntry(
                sprintf('Order %s is prepared to be paid through Mollie', $order->getOrderNumber()),
                $salesChannelContext->getContext(),
                null,
                [
                    'orderData' => $orderData,
                ]
            );
        }

        /**
         * Create an order at Mollie based on the prepared
         * array of order data.
         *
         * @throws ApiException
         * @var Order $mollieOrder
         */
        try {
            $mollieOrder = $this->apiClient->orders->create($orderData);
        } catch (ApiException $e) {
            $this->logger->addEntry(
                $e->getMessage(),
                $salesChannelContext->getContext(),
                $e,
                [
                    'function' => 'finalize-payment',
                ],
                Logger::ERROR
            );

            throw new RuntimeException(sprintf('Could not create Mollie order, error: %s', $e->getMessage()));
        }

        /**
         * Store the ID of the created order at Mollie on the
         * order in Shopware. We use this identifier to retrieve
         * the order from Mollie after payment to set the order
         * and payment status.
         */
        if (isset($mollieOrder, $mollieOrder->id)) {
            $this->orderService->getOrderRepository()->update([[
                'id' => $order->getId(),
                'customFields' => [
                    CustomFieldService::CUSTOM_FIELDS_KEY_MOLLIE_PAYMENTS => [
                        'order_id' => $mollieOrder->id,
                        'transactionReturnUrl' => $transaction->getReturnUrl(),
                    ]
                ]
            ]], $salesChannelContext->getContext());

            // Update the order lines with the corresponding id's from Mollie
            $orderLineUpdate = [];

            /** @var OrderLine $line */
            foreach ($mollieOrder->lines as $line) {
                if (isset($line->metadata->{ $this->orderService::ORDER_LINE_ITEM_ID })) {
                    $orderLineUpdate[] = [
                        'id' => $line->metadata->{ $this->orderService::ORDER_LINE_ITEM_ID },
                        'customFields' => [
                            CustomFieldService::CUSTOM_FIELDS_KEY_MOLLIE_PAYMENTS => [
                                'order_line_id' => $line->id,
                            ],
                        ],
                    ];
                }
            }

            if (!empty($orderLineUpdate)) {
                $this->orderService->getOrderLineItemRepository()->update(
                    $orderLineUpdate,
                    $salesChannelContext->getContext()
                );
            }
        }

        /**
         * Return the payment URL from the Mollie order, we redirect
         * the customer to this URL to finish the payment.
         *
         * Afterwards, the customer is redirect to the finish page
         * in Shopware, which leads to @finalize()
         *
         * @var string $paymentUrl
         */
        return isset($mollieOrder) ? $mollieOrder->getCheckoutUrl() : null;
    }

    /**
     * Sets the API keys for Mollie based on the current context.
     *
     * @param SalesChannelContext $context
     *
     * @throws ApiException
     */
    private function setApiKeysBySalesChannelContext(SalesChannelContext $context): void
    {
        try {
            /** @var MollieSettingStruct $settings */
            $settings = $this->settingsService->getSettings($context->getSalesChannel()->getId());

            /** @var string $apiKey */
            $apiKey = $settings->isTestMode() === false ? $settings->getLiveApiKey() : $settings->getTestApiKey();

            // Log the used API keys
            if ($settings->isDebugMode()) {
                $this->logger->addEntry(
                    sprintf('Selected API key %s for sales channel %s', $apiKey, $context->getSalesChannel()->getName()),
                    $context->getContext(),
                    null,
                    [
                        'apiKey' => $apiKey,
                    ]
                );
            }

            // Set the API key
            $this->apiClient->setApiKey($apiKey);
        } catch (InconsistentCriteriaIdsException $e) {
            $this->logger->addEntry(
                $e->getMessage(),
                $context->getContext(),
                $e,
                [
                    'function' => 'set-mollie-api-key',
                ],
                Logger::ERROR
            );

            throw new RuntimeException(sprintf('Could not set Mollie Api Key, error: %s', $e->getMessage()));
        }
    }
}