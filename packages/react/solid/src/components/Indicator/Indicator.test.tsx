import { renderWithApp } from "~test/renderWithApp";
import { Indicator } from "./Indicator";
import { TLSolidShape } from "~/options/solid/src/lib";

describe("Indicator", () => {
  test("mounts component without crashing", () => {
    class ShapeClass extends TLSolidShape {
      static id = "box";
      SolidComponent = () => <div>Hi</div>;
      SolidIndicator = () => <text>Hi</text>;
      getBounds = () => ({
        minX: 0,
        minY: 0,
        maxX: 100,
        maxY: 100,
        width: 100,
        height: 100
      });
    }
    const shape = new ShapeClass({ id: "box", parentId: "page1", type: "box", point: [0, 0] });
    renderWithApp(<Indicator shape={shape}>Hi</Indicator>);
  });
});
