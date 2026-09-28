### web and store

## Try at Home requests

The bag holds up to five pieces. Customers can use the same bag to purchase through Shopify Checkout or submit a Try at Home request on this site. Trial requests are created as Shopify draft orders tagged `Try at Home` and `Pending review`; they do not collect payment or reserve inventory automatically. Staff must review availability and arrange delivery before fulfilling a request.

Configure a Shopify Admin API access token with the `write_draft_orders` scope and set these server-only environment variables:

```text
SHOPIFY_ADMIN_API_VERSION=2026-07
SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_api_access_token
```

The existing `SHOPIFY_STORE_DOMAIN` setting is reused. Without the Admin API settings, the form will show a submission error and no request will be created.
