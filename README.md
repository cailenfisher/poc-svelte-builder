This will probably serve as a first version of the actual SvelteBuilder scaffold project, but also include the UI component library and the i18n toolkit library in one simple SvelteKit project

This will also serve as an exploration platform for some outstanding questions, like how much of the language (localized content) support can be put into the library and what has to stay in the scaffold/project template code.

Thoughtful .env based configuration- even the POC version of this should be deployable to Vercel etc by anyone and result in a correctly customized application.

Target semantic markup and accessibility standards from the beginning, as strictly as possible.

Clear and solid error management from the beginning. Aim for some kind of safe integration with language support for user facing error messages.

Auth

-   Supabase and Lucia implementation later? Might be easier to get clean SSO, fast, with Supa. Investigate.

    -   The decision on this probably influences the decision on targeting Supabase or Drizzle for POC API\
UI Component Library

-   Lowest common denominator of application UI I always find myself building

    -   Navigation

    -   Action buttons

    -   Icons

    -   User/profile widgets

    -   Forms

    -   Post/comment widgets (nearly universal, but this is probably bordering into overly specific)

Language Support

-   API for content

    -   SvelteKit routes, final version should allow custom URLs and work in plain Svelte (client side)

    -   Target Drizzle from the beginning or start with Supabase?

-   Load function

    -   Takes JSON/POJO retrieved from API, in correct custom Type

    -   Overloaded to accept pre-merged/filtered dictionary or raw data

    -   Stored in shared rune

-   Output

    -   Simple Svelte component with overloadable parameters to narrow scope and target individual dynamic content items. Scope defaults to "global", contentId defaults to null- which triggers different logic. A non-null contentId will filter an ID indexed array for a given slug instead of just finding by slug and scope. This component can be wrapped/extended for friendly syntax.

        -   `<LocalText slug="my_content" />`

        -   `<LocalText slug="my_content" scope="moduleName" />`

        -   `<LocalText slug="my_content" scope="moduleName" contentId="13" />`

        -   `<BlogWelcomeText blog="42" />`

    -   Explore best option for inline output - try to consider how to keep the most functionality in the eventual library

        -   Shared store with custom getter? $lt.slug("my_content")

        -   Share state rune wrapped in a custom function? localText("my_content")
