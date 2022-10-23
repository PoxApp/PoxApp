import { newE2EPage } from '@stencil/core/testing';

xdescribe('ai-image-recognizer', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ai-image-recognizer></ai-image-recognizer>');

    const element = await page.find('ai-image-recognizer');
    expect(element).toHaveClass('hydrated');
  });
});
