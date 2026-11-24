/*
 * The Shopify section read `settings.about_video_file_url`, falling back to
 * `settings.about_us_image`. Only the video was ever set:
 *   https://cdn.shopify.com/videos/c/o/v/1a3b265b8dd645c7aae2440a8442602e.mp4
 * It is re-encoded and self-hosted now — 5.98 MB to 1.57 MB, no quality cost
 * at the size it renders.
 *
 * The CTA pointed at /pages/about-us, which is /about here.
 */
export const ABOUT_INTRO = {
  headingKey: 'aboutus_section_heading_text',
  // An array so the copy can be split into real paragraphs later without
  // touching the component.
  bodyKeys: ['aboutus_section_paragraph_text'],
  cta: { labelKey: 'aboutus_section_redirection_text', to: '/about' },
  media: {
    type: 'video',
    formats: ['about/fcec-about.mp4'],
    poster: 'about/fcec-about.jpg',
  },
}

/*
 * The About page itself (page.about.liquid).
 *
 * The template opened with an "Our Portfolio" block playing
 * `settings.introductory_video_file_url`. Left out at your request; the URL
 * is recorded so the block can come back without hunting for it:
 *   https://cdn.shopify.com/videos/c/o/v/4c7d9ba8ec874e9e9611a07cc3f2a853.mp4
 * It carried a "Download Video" link beside it, and a `downloadVideo()`
 * helper in the page script that nothing ever called.
 *
 * Both images are the theme's own settings — `CEO_image` and `company_image`
 * — re-exported at a delivery size. Each of the four translated parts is a
 * real paragraph: the template ran all four into one <p> separated by
 * <br><br> pairs, which is a paragraph break typed rather than marked up.
 */

export const ABOUT_PAGE_TITLE_KEY = 'nav.about'

/** Both exports are square, so one pair of dimensions covers the page. */
export const ABOUT_IMAGE = { width: 1024, height: 1024 }

export const ABOUT_BLOCKS = [
  {
    id: 'ceo-message',
    headingKey: 'about_template_heading_1',
    bodyKeys: [
      'about_template_paragraph_1_part1',
      'about_template_paragraph_1_part2',
      'about_template_paragraph_1_part3',
      'about_template_paragraph_1_part4',
    ],
    image: 'page-about/ceo.webp',
  },
  {
    id: 'our-story',
    headingKey: 'about_template_heading_2',
    bodyKeys: [
      'about_template_paragraph_2_part1',
      'about_template_paragraph_2_part2',
      'about_template_paragraph_2_part3',
      'about_template_paragraph_2_part4',
    ],
    image: 'page-about/our-story.webp',
    // Image leads at desktop, as it did in the theme. `order` follows the
    // writing direction, so this mirrors itself in Arabic.
    flip: true,
  },
]
