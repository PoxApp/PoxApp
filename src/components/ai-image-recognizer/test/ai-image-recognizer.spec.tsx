import { newSpecPage } from '@stencil/core/testing';
import { AiImageRecognizer } from '../ai-image-recognizer';

xdescribe('ai-image-recognizer', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AiImageRecognizer],
      html: `<ai-image-recognizer></ai-image-recognizer>`,
    });
    expect(page.root).toEqualHtml(`
      <ai-image-recognizer>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ai-image-recognizer>
    `);
  });
});
