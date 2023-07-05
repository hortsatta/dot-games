![Project logo.](/src/assets/images/logo.png)

**[dotGames](https://dot-games-zeta.vercel.app/)** is a prototype e-commerce website for a shop that exclusively sells playstation video game products.
It is written in Typescript and uses the React library and Nextjs framework.

To run locally, you need to create a [supabase](https://www.supabase.com/), [rawg.io](https://rawg.io/), and [stripe](https://stripe.com/) account. Then obtain their API keys and add the following environmental variables

```bash
NEXT_PUBLIC_META_TITLE
NEXT_PUBLIC_META_AUTHOR
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SUPABASE_BUCKET_NAME
NEXT_PUBLIC_SUPABASE_MEDIA_BASE_URL
NEXT_PUBLIC_RAWG_API_URL
NEXT_PUBLIC_RAWG_API_KEY
NEXT_PUBLIC_RAWG_MEDIA_BASE_URL
NEXT_PUBLIC_COUNTRIES_API_URL=https://countriesnow.space/api/v0.1/countries
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_SAMPLE_USER_EMAIL
NEXT_PUBLIC_SAMPLE_USER_PASSWORD
STRIPE_SECRET_KEY
```
