export const siteMetadata = {
  title: {
    default: `${process.env.NEXT_PUBLIC_META_TITLE}`,
    template: `%s — ${process.env.NEXT_PUBLIC_META_TITLE}`,
  },
  authors: [
    {
      name: process.env.NEXT_PUBLIC_META_AUTHOR,
    },
  ],
};
