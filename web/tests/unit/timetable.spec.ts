import { shallowMount } from "@vue/test-utils";
import { ref } from "vue";

const getTimeTable = ref({
  pageTitle: "Programma",
  introduction: null,
  intermezzo: null,
  firstSetlist: [],
  lastSetList: [],
});
const getHomepage = ref<any[]>([]);
const getSongRatings = ref(true);

jest.mock("vue-router", () => ({
  useRoute: () => ({ params: { id: "test-concert" } }),
}));

jest.mock("../../src/components/Partials/TimeTableBlock.vue", () => ({
  default: { name: "TimeTableBlock", template: "<div />" },
}));
jest.mock("../../src/components/FeedBackForm.vue", () => ({
  default: { name: "FeedBackForm", template: "<div />" },
}));
jest.mock("../../src/components/EventList.vue", () => ({
  default: { name: "EventList", template: "<div />" },
}));

const useContentMock = jest.fn((id: string, _ctx?: unknown) => {
  if (id === "timetable") return { getTimeTable };
  if (id === "home") return { getHomepage };
  return {};
});

jest.mock("@/composables/useContent", () => ({
  useContent: (id: string, ctx: unknown) => useContentMock(id, ctx),
}));

const fetchSongRatings = jest.fn();
jest.mock("@/composables/useFeedback", () => ({
  useFeedback: () => ({ fetchSongRatings, getSongRatings }),
}));

const TimeTablePage = require("../../src/views/concert/timetable.vue").default;

describe("TimeTablePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getHomepage.value = [];
  });

  it("shows upcoming events block when homepage contains event list content", () => {
    getHomepage.value = [
      {
        __typename: "AppList",
        eventlistCollection: {
          items: [{ title: "Concert", date: "2099-01-01T20:00:00.000Z" }],
        },
      },
    ];

    const wrapper = shallowMount(TimeTablePage);

    expect(useContentMock).toHaveBeenCalledWith("home", undefined);
    expect(wrapper.text()).toContain("Aankomende evenementen");
    expect(wrapper.findComponent({ name: "EventList" }).exists()).toBe(true);
  });

  it("hides upcoming events block when no event list content exists", () => {
    const wrapper = shallowMount(TimeTablePage);

    expect(wrapper.text()).not.toContain("Aankomende evenementen");
    expect(wrapper.findComponent({ name: "EventList" }).exists()).toBe(false);
  });
});
