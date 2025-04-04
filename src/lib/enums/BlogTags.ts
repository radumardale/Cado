export enum BlogTags {
    RECOMMENDATIONS = "RECOMMENDATIONS",
    NEWS = "NEWS",
    EXPERIENCES = "EXPERIENCES",
  };

  export const BlogTagsArr = Object.values(BlogTags).filter(value => typeof value === 'string') as string[];