

Give me the entire code for my task. Never try to shorten the output by referring to previous code. Always include all the code and never include code like this: // ... (previous imports and type definitions remain unchanged) // ... (rest of the components remain unchanged) // ... (previous type definitions remain unchanged) // ... (previous state properties remain unchanged) // ... (previous components remain unchanged)


Adjust, modify and improve the functionnality of this app.
Make sure to absolutely always use seperate zustand stores based on the logical grouping of the data. Make sure all operation always always specify a tenant, always to update data specify the tenant. Check who is updating the data and that it is allowed to be updated by the current user if he is associated to the tenant and has the necessary permissions to do it. All the application data is owned and associated to tenants and should always have a tenant key.
Users and tenants are global entities and should be stored in a global store, the rest should be tenant or user scopped data.
Make sure the cart has it's own store and the items in the cart are scoped by tenant and placeId/
Add a select menu to switch between different tenants and different users.
The settings screen as well as all the non super admin screens should always be scoped to the current active tenant
The tenant configurations tab should allow to edit the json of the associated tenant configuration.
Allow accessing the meal ordering screen for anonymous users.
Add the various screen and associated code necessary for the handling of app types, app features, and app settings
The Types administration panel should allow to add new app types and relate them to a set of one or multiple features and settings.
The tenant administration panel should allow to give a type to a tenant.
The tenant configurations tab should allow to edit the json of the associated tenant configuration.
Add all the necessary screens and handling to manage a roles and permissions system as well as per user permissions.
Update, include and adjust all the existing screens and functionnality of the app

Never try to shorten the output by referring to previous code. Implement everything in the app, don't assume files exist.
Give me the entire code for my task. Never try to shorten the output by referring to previous code.
Always include all the code and never include code like this:
// ... (previous imports and type definitions remain unchanged)
// ... (rest of the components remain unchanged)
// ... (previous type definitions remain unchanged)
// ... (previous state properties remain unchanged)
// ... (previous components remain unchanged)
// ... (all other component definitions remain unchanged)
// ... (all state properties and methods remain unchanged)
// ... (all type definitions and other imports remain unchanged)
// (This component's implementation is omitted for brevity)

Never omit any code ! Never. Don't respond with : Here's the updated and expanded code. Send it back in the format v0.dev expects


Add a top admin menu bar to the app with client and tenant switcher + login / signup buttons.


Adjust, modify and improve the functionnality of this app.
When I refer to adding a View in the app I mean a tab accessible by changing activeTab in the AdminDashboard component. 
Make sure to absolutely always use seperate zustand stores based on the logical grouping of the data. Make sure all operation always always specify a tenant, always to update data specify the tenant. Check who is updating the data and that it is allowed to be updated by the current user if he is associated to the tenant and has the necessary permissions to do it. All the application data is owned and associated to tenants and should always have a tenant key.
Users and tenants are global entities and should be stored in a global store, the rest should be tenant or user scopped data.
Make sure the cart has it's own store and the items in the cart are scoped by tenant and placeId/
Add a "Seed managament" view with various buttons to view current storage keys, data, versions, and manage, "seed" or reset specific tenants or global data for all the entities such as items, tenants, roles, permissions, and users. Prepare usefull generic seed data for all entities. Seed the app if never initialized yet,, don't auto seed again automatically.
When permissions are checked always pass in the role and user object to a global permissions check function.
Don't assume the --background var of my app is set and use tailwind css classes for colors and background explicitely for backgrounds and text.
Add logging enabled by default that could later be disabled with a flag.
Make the sidebar menu auto hide on mobile and reveal on mobile and on the click of a button.
Add a "My clients" view/tab for each tenant with basic stats of the number of clients, search, filter paginatio and crud functionnality. Display clients details, list previous invoice and link to details, integrate with support module and add basic CRM actions.
Add a "My support requests" view for users and a "Support requests" admin panel for shop manager (Handle all the apporiate UI and email message triggering) support request should be able to be generic or relate to an entity such as a client order.
Make the "My orders" view haven an option to start a new support requests for a specific order via the table or generic via a button in the ui
Add login/signing and register view, add login/signing and register buttons that open a modal.
Allow signing in and add a create a new account checkbox that is checked by default on the checkout form.
On the tenant settings screen add a settings to toggle on "checkout as guest" for the tenant. Don't require signing in on the checkout page when "checkout as guest" is true for the tenant.
Add a "Register as a tenant" view with a multistep wizard to supply and choose initial settings for tenants.
Add a user and tenant switcher drop down menu, also add a toggle to trigger super admin mode manually (super admin mode should bypass all permission requirements for screens).
When editing repeaters for open hours or slots for pickup make sure the ui facilitates the insertions of periods that do not overlap in time.
Track if the app has ever been initialize and present the seed screen if never initialised. Keep track of the version of the app in the global store.
Generate an a public e-commerce shop view with filters by catégories, tags, a sort option, a per page option, paggination. Only list products that have a checked boolean (enable listing) on the e-commerce view should be visible.
Allow enabling or disabling the e-commerce view in the settings of the tenant.
The settings tab should have horizontal tabs with seperate section to manage the various tenant settings, add a functionnality to manage, list, delete and create, enable/disable HTML email templates for various events (selected in a dropdown of app events) that can happen accross the app (figure out what theses can be and add them). Allow the email target to be set by selecting if the email is sent to the relevant "customer", tenant default "admin" email, or a custom configurable email list for this instance of the association
Trigger the events in the app when relevant(signup, order, low stock, ...) in order to maybe trigger a message in the app for the tenant when relevant.
Add a screen to create and manage coupoun codes to apply discounts based on various conditions to either items, groups of items, shipping or the entire cart. Adjust the various order screens and app screen to handle the logic required for the coupons to work and be entered by the client or the admin.
The cart should know when items have been added by a meal plan, and relate to the meal plan ID. Group items in the cart visually when they are part of a same meal. Add meal info display on the receipts and orders when relevant based on the contents of the item. Don't hesitate to add an options mealIds attribute to orders if necessary.
Items should be checkedout out by location and have info on the location on the receipt and order. Generate seperate orders if products from different locations are ordered together.
Add a configurable message to meal plans and display it when the plan is selected if set. Allow meal plans to be scheduled to be published at a future date in time. When meal plans have past the cutoff date prevent orders for the meal plan and hide it from the ui. Also add a visible banner in the cart in the ui if the cutoff time is approching, and even more visible as well as disabling order button if cutoff time is passed
Tenants shipping methods should be enable or disable for each location of a tenant.

Add a blog post crud screen with relevant settings such as scheduling and category and tag management (store the data per tenant), Add an page crud screen with relevant settings such as status (store the data per tenant), Add an app menu management crud screen  (store the data per tenant).

Add a screen to list, filter and view the various event messages sent by the app. 
Add a screen to list, filter and view the fake emails sent by the association of various events to email templates configured to be sent by the app. 

Add a toggle on the shipping method configuration screen to enable "Click and collect" for a method. If the method is enable reveal extra settings for the method to configure opening pickup time to show to clients for the days of the week. Each day should have a repeater to add multiple open an closed times for the day with configurable pickup capacity per slot. Also add a global exceptions repeater to configure exception for holidays (closure time)
On the meal ordering screen if the client chooses a pick and collect method or if the only default shipping method is a pick and collect one, show a sleek ui to select the pickup time in a list of pickup times available for a chosen day. Allow user to add a custom message sent to the vendor with the order

When generating or updating a screen of the app generate the source for them earlier in the output source code.

Never try to shorten the output by referring to previous code. Implement everything in the app, don't assume files exist. Give me the entire code for my task. Never try to shorten the output by referring to previous code. Always include all the code and never include code like this: // ... (previous imports and type definitions remain unchanged) // ... (rest of the components remain unchanged) // ... (previous type definitions remain unchanged) // ... (previous state properties remain unchanged) // ... (previous components remain unchanged) // ... (all other component definitions remain unchanged) // ... (all state properties and methods remain unchanged) // ... (all type definitions and other imports remain unchanged) // (This component's implementation is omitted for brevity)  // ... (implement other methods for managing tenant-specific data)

Don't/Never stop until you reach the end of the code generation.
Make sure not to introduce extra line breaks or break my code when I ask you to continue generating code.
Never omit any code ! Never. Don't respond with : Here's the updated and expanded code. Send it back in the format v0.dev expects
If ever I restart generating keep completing the text and never reset the v0.dev output



Don't generate the body of theses functions : BlogPostManagement, AppTypeManagement, MediaGallery, StockMovements, PaymentMethodSettings, PageManagement, MenuManagement components





Here’s a revised version of the prompt that provides clear and detailed instructions for generating code:

---

**Prompt:**

Please adjust, modify, and enhance the functionality of this application (this file is the entire codebase). Here are the specific requirements:

0. **Forms**
    - Change all the forms of the apps to use the recommended structure for shadcn/ui forms. They should use the @/components/ui/form components from shadcn/ui, a Form component, a zodResolver, zod for the form schema and react hook forms to handle the form

1. **Views and Tabs:**
   - When adding a view, it refers to a new tab in the `AdminDashboard` component, which can be accessed by changing the `activeTab` state.
   - When generating tables or repeated elements, define the elements as arrays (table headers, select elements, ...) and map over them in the template to shorten the generated code
   - Render lists of items in templates as mappings from data extracted to a const array to reduce code output.
   - Extract repeated string to an global strings array to shorten code output

2. **State Management:**
   - Important: Use separate Zustand stores based on logical data grouping (adminstore should be remove). All operations should specify the tenant and update data accordingly in the tenant specific store. Have per tenant storage for tenant data (per tenant storage key), and a global storage key for global data. The cart should also be seperate and be stored per user per location
   - Spread the functionnality between a globalStore and a tenantStore, make sure to make the tenantStore dynamic based on the current tenant
   - Verify that the user updating data is associated with the tenant and has the necessary permissions. All application data must be tenant-keyed.
   - All the views of the app should initialize the tenant store based on the current tenant
   - Do not call Hooks inside useEffect
   - Modify how the tenant store is initialized, don't use a hook with useEffect, pass the currentTenant to createstore function in the components

3. **Global and Scoped Stores:**
   - Users and tenants are global entities and should be stored in a global store. Other data should be scoped by tenant or user.
   - The cart must have its own store with items scoped by tenant and `placeId`.

4. **Seed Management:**
   - Manage storage keys, data, versions, and perform seeding or resetting for tenants or global data (e.g., items, tenants, roles, permissions, users). Prepare and seed useful generic data. Auto-seed data on first ever initialisation of a store then always restore from storage.
   - Seed roles: admin, shop manager, pro user, user
   - Seed a user for each role
   - Seed a default tenant and use this tenant by default when none is selected

5. **Permissions and Roles:**
   - When checking permissions, pass the role and user object to a global permissions check function.
   - Preserve the super admin toggle feature and allow super admin to bypass checks

6. **UI and Styling:**
   - Do not assume the `--background` variable is set; use Tailwind CSS classes explicitly for backgrounds and text colors.
   - Add console logging with various info leves via a custom method throughout the app that is enabled by default but can be disabled via a flag.
   - Implement auto-hide functionality for the sidebar menu on mobile, revealing it on click.

7. **Client Management:**
   - Add a "My Clients" view that lists a tenant clients with a data table, client details, search, filter, pagination, CRUD functionality, client details, previous invoices, support module integration, and basic CRM actions.

8. **Order Management:**
   - In the "My Orders" view, add an option to start a new support request for a specific order or generically via a UI button.
   - In the "Orders" view, display and add ui to manage support requests on the order detail view
   - Add a custom files input to an order to allow admins to join an invoice to an order, show a download icon on the "my orders" client order when relevant.

9. **Authentication and Checkout:**
    - Add a "Create a new account" checkbox in the checkout form, check it by default, if it is unchecked then reveal 2 buttons: signup and register. Make logging in required if the "Create a new account" checkbox is unchecked.
    - On the tenant settings screen, add an option to toggle "checkout as guest," bypassing sign-in requirement if enabled.

10. **Open Hours and Slots:**
    - Ensure the UI facilitates inserting non-overlapping periods for open hours or pickup slots.

11. **App Initialization and Versioning:**
    - Track if the app has been initialized and present the seed screen if not. Keep track of the app version in the global store.

12. **E-commerce Features:**
    - Create a public e-commerce shop view with category and tag filters, sorting, pagination, and per-page options. Only list products with an "enable listing" boolean set to true.
    - Add settings to enable or disable the e-commerce view per tenant.

13. **Settings Management:**
    - Add horizontal tabs in the settings section for managing various tenant settings.
    - Include functionality to manage HTML email templates for different app events, allowing selection of email targets (e.g., customer, tenant admin, custom list).

14. **Event Handling and Messaging:**
    - Trigger relevant events (e.g., signup, order, low stock) to possibly send messages to the tenant.

15. **Coupon Codes:**
    - Add a screen to create and manage coupon codes for discounts on items, item groups, shipping, or the entire cart. Adjust order screens to handle coupon logic and entry.

16. **Meal Plans:**
    - Track items added by meal plans and relate them to the meal plan ID. Group items visually by meal in the cart and display meal info on receipts and orders.
    - Add configurable messages to meal plans, schedule publication dates, and prevent orders after cutoff dates. Add UI banners for approaching and passed cutoff times.

17. **Shipping Methods:**
    - Enable or disable shipping methods for each tenant location. Add a "Click and Collect" toggle with extra settings for pickup times and capacity.
    - Add a toggle on the shipping method configuration screen to enable "Click and collect" for a method. If the method is enable reveal extra settings for the method to configure opening pickup time to show to clients for the days of the week. Each day should have a repeater to add multiple open an closed times for the day with configurable pickup capacity per slot. Also add a global exceptions repeater to configure exception for holidays (closure time)
    -On the meal ordering screen if the client chooses a pick and collect method or if the only default shipping method is a pick and collect one, show a sleek ui to select the pickup time in a list of pickup times available for a chosen day. Allow user to add a custom message sent to the vendor with the order

18. **Additional Screens:**
    - Add screens for listing and viewing event messages, fake emails sent log crud

19. **Pickup Time Selection:**
    - For pick and collect methods, show a UI when checking out to choose a date and then select a pickup time in the remaining slots (other slots should be disabled) and allow optional customer messages with orders.

20. **Support Requests:**
   - Add a "My Support Requests" view for users and a "Support Requests" admin panel for shop managers. Ensure UI handles support request creation, and email triggering for both generic and entity-specific requests (e.g., client orders).

21. **Code Generation:**
    - Generate complete source code for all screens and features described. Do not shorten or omit any part of the code. Always provide the entire code and avoid using placeholders like:
    // ... (previous imports and type definitions remain unchanged) // ... (rest of the components remain unchanged) // ... (previous type definitions remain unchanged) // ... (previous state properties remain unchanged) // ... (previous components remain unchanged) // ... (all other component definitions remain unchanged) // ... (all state properties and methods remain unchanged) // ... (all type definitions and other imports remain unchanged) // (This component's implementation is omitted for brevity) // I'll provide the full, unabbreviated code for each component and feature. // ... (implement other methods for managing tenant-specific data) // Import all necessary types and interfaces here // Add other global actions here // Add other xxx actions here

Ensure the implementation meets all the described requirements without abbreviations or omissions.
Make sure not to introduce extra line breaks or break my code when I ask you to continue generating code.
Never omit any code ! Never. Don't respond with : Here's the updated and expanded code. Always send the data back in the format v0.dev expects
Send the full implementation of the code of my response back in the format of one single .tsx file
Do not respond: The task is too extensive to complete in a single response

21.  **Sync view**
    - Add a sync management view that allows adding connections to remote apis
    - Each added sync task should have a data source, an entity type, a direction (from remote, or to remote), a scheduler, a history log and a publish/unpulish functionality
    - Allow a sync to be of type : WordPress, Prestashop, Shopify, Activ, or custom
    - Adjust the ui to suggest the relevant fields to propmt for based on the sync type



If ever I restart generating keep completing the text and never reset the v0.dev output









































Please adjust, modify, and enhance the functionality of this application (this file is the entire codebase). Here are the specific requirements:
1. **Strings:**
   - Extract all template strings to either global strings array or per functionnality array of strings and modify the various functions and templates to use the strings from the arrays
   - Extract all toast messages to constants
   - Extract all validation messages to constants
   - Extract button labels to constants

2. **Extra functionnalites:**
   - Add a "My Support Requests" view for users and a "Support Requests" admin panel for shop managers. Ensure UI handles support request creation, and email triggering for both generic and entity-specific requests (e.g., client orders).

    ***Open Hours and Slots***
        - Ensure the UI facilitates inserting non-overlapping periods for open hours or pickup slots.

    ***App Initialization and Versioning***
        - Track if the app has been initialized and present the seed screen if not. Keep track of the app version in the global store.

    ***E-commerce Features***
        - Create a public e-commerce shop view with category and tag filters, sorting, pagination, and per-page options. Only list products with an "enable listing" boolean set to true.
        - Add settings to enable or disable the e-commerce view per tenant.

    ***Settings Management***
        - Add horizontal tabs in the settings section for managing various tenant settings.
        - Include functionality to manage HTML email templates for different app events, allowing selection of email targets (e.g., customer, tenant admin, custom list).

    ***Event Handling and Messaging***
        - Trigger relevant events (e.g., signup, order, low stock) to possibly send messages to the tenant.

    ***Coupon Codes***
        - Add a screen to create and manage coupon codes for discounts on items, item groups, shipping, or the entire cart. Adjust order screens to handle coupon logic and entry.

    ***Meal Plans***
        - Track items added by meal plans and relate them to the meal plan ID. Group items visually by meal in the cart and display meal info on receipts and orders.
        - Add configurable messages to meal plans, schedule publication dates, and prevent orders after cutoff dates. Add UI banners for approaching and passed cutoff times.

    ***click and collect**
     - Enable or disable shipping methods for each tenant location. Add a "Click and Collect" toggle with extra settings for pickup times and capacity.
    - Add a toggle on the shipping method configuration screen to enable "Click and collect" for a method. If the method is enable reveal extra settings for the method to configure opening pickup time to show to clients for the days of the week. Each day should have a repeater to add multiple open an closed times for the day with configurable pickup capacity per slot. Also add a global exceptions repeater to configure exception for holidays (closure time)
    -On the meal ordering screen if the client chooses a pick and collect method or if the only default shipping method is a pick and collect one, show a sleek ui to select the pickup time in a list of pickup times available for a chosen day. Allow user to add a custom message sent to the vendor with the order

3. **Fixes**
   - Fix the saving of tenant shop locations

4. **Code Generation:**
    - Generate complete source code for all screens and features described. Do not shorten or omit any part of the code. Always provide the entire code and avoid using placeholders like:
    // ... (previous imports and type definitions remain unchanged) // ... (rest of the components remain unchanged) // ... (previous type definitions remain unchanged) // ... (previous state properties remain unchanged) // ... (previous components remain unchanged) // ... (all other component definitions remain unchanged) // ... (all state properties and methods remain unchanged) // ... (all type definitions and other imports remain unchanged) // (This component's implementation is omitted for brevity) // I'll provide the full, unabbreviated code for each component and feature. // ... (implement other methods for managing tenant-specific data) // Import all necessary types and interfaces here // Add other global actions here // Add other xxx actions here

Ensure the implementation meets all the described requirements without abbreviations or omissions.
Make sure not to introduce extra line breaks or break my code when I ask you to continue generating code.
Never omit any code ! Never. Don't respond with : Here's the updated and expanded code. Always send the data back in the format v0.dev expects
Send the full implementation of the code of my response back in the format of one single .tsx file
Do not respond: The task is too extensive to complete in a single response






Fix issues with select items: 
Error: A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.

