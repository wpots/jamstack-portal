import { shallowMount } from "@vue/test-utils";
import AppIFrame from "@/components/AppIFrame.vue";

describe("AppIFrame.vue", () => {
  it("renders iframe src from props", () => {
    const src = "https://example.com/embed";
    const wrapper = shallowMount(AppIFrame, {
      props: { src },
    });

    expect(wrapper.find("iframe").attributes("src")).toBe(src);
  });
});
