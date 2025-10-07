### Issue Title:
Implement Fix for monitorPricingPages Extraction Logic

### Description:
We need to fix the extraction logic in the `monitorPricingPages` function to ensure it correctly parses the `.pricing-plan` elements. The extraction should include:

- **Plan Name**: Extracted from the `<h3>` inside `.pricing-plan`
- **Price**: Extracted as a numeric value from `.price` (e.g., "$9.99/month" → 9.99)
- **Features**: Extracted from the `<ul>` list within `.pricing-plan`
- **isPopular**: Set to `true` if the class "popular" is present.

This implementation must meet the expectations outlined in the test file `test/web-scraping-service.test.ts`.

### Code Snippet for Price Extraction:
```javascript
function extractPrice(priceString) {
    const priceMatch = priceString.match(/\$([\d.,]+)/);
    return priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : null;
}
```

### Reference:
- Related test file: `test/web-scraping-service.test.ts`
- Commit reference: a90cead798a52f065e4feb7a92ce6386713ef893

### Additional Notes:
Make sure to run the tests after implementing the changes to confirm that everything functions as expected.