<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Customer\Middleware\Address;


use function Polavi\dispatch_event;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class CreateMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $variables = $request->get('variables', []);
        $query = "mutation CreateCustomerAddress(\$address: AddressInput! \$customerId: Int!) { createCustomerAddress (address: \$address customerId: \$customerId) {status message address {customer_address_id full_name telephone address_1 address_2 postcode city province country is_default update_url delete_url}}}";

        dispatch_event("filter_create_customer_address_query", [&$query]);

        $response->notNewPage();
        $promise = $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query" => $query,
                "variables" => $variables
            ]);

        $promise->then(function ($result) use ($request, $response) {
            $response->addData('addressCreation', $result->data['createCustomerAddress']);
        });

        $promise->otherwise(function ($reason) use ($request, $response) {
            // TODO: Support development mode and show real message
            $response->addData('addressCreation', ['status'=> false, 'message'=> $reason[0]->message]);
        });

        return $promise;
    }
}