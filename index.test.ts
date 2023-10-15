import { getDifference } from "./index";

// Primitives

test("string", () => {
  expect(getDifference("wingspan", "Wingspan")).toStrictEqual("Wingspan");
  expect(getDifference("Wingspan", "Wingspan")).toStrictEqual(undefined);
});

test("number", () => {
  expect(getDifference(1, 2)).toStrictEqual(2);
  expect(getDifference(1, 1)).toStrictEqual(undefined);
});

test("boolean", () => {
  expect(getDifference(false, true)).toStrictEqual(true);
  expect(getDifference(false, false)).toStrictEqual(undefined);
});

// Objects (depth 1)

test("object with all props changed", () => {
  expect(
    getDifference(
      {
        prop1: "some string",
        prop2: 100,
        prop3: false,
      },
      {
        prop1: "some changed string",
        prop2: 200,
        prop3: true,
      }
    )
  ).toStrictEqual({
    prop1: "some changed string",
    prop2: 200,
    prop3: true,
  });
});

test("object with some props changed", () => {
  expect(
    getDifference(
      {
        prop1: "some string",
        prop2: 100,
        prop3: false,
      },
      {
        prop1: "some string",
        prop2: 200,
        prop3: true,
      }
    )
  ).toStrictEqual({
    prop2: 200,
    prop3: true,
  });
});

test("object with properties which did not exist", () => {
  expect(
    getDifference(
      {
        prop1: "some string",
        prop2: 100,
        prop3: false,
      },
      {
        newProp: "new prop added",
        newNumber: 500,
      }
    )
  ).toStrictEqual({
    newProp: "new prop added",
    newNumber: 500,
  });
});

test("object with no diff", () => {
  expect(
    getDifference(
      {
        prop1: "some string",
        prop2: 100,
        prop3: false,
      },
      {
        prop1: "some string",
        prop2: 100,
        prop3: false,
      }
    )
  ).toStrictEqual(undefined);
});

// Objects (multiple depth levels)

test("object with 2 levels of depth", () => {
  expect(
    getDifference(
      {
        email: "some@email.com",
        profile: {
          firstName: "Some",
          lastName: "Name",
          phoneNumber: "0000000000",
        },
      },
      {
        email: "some@email.com",
        profile: {
          firstName: "Some",
          lastName: "Name",
          phoneNumber: "1111111111",
        },
      }
    )
  ).toStrictEqual({
    profile: {
      phoneNumber: "1111111111",
    },
  });
});

test("object with 3 levels of depth", () => {
  expect(
    getDifference(
      {
        email: "some@email.com",
        profile: {
          firstName: "Some",
          lastName: "Name",
          phoneNumber: "0000000000",
          address: {
            country: "US",
            state: "NY",
          },
          company: {
            name: "Wingspan",
            taxId: "1234",
          },
        },
      },
      {
        email: "some@email.com",
        profile: {
          firstName: "Some",
          lastName: "Name",
          phoneNumber: "1111111111",
          address: {
            country: "US",
            state: "CA",
          },
          company: {
            name: "Wingspan",
            taxId: "12345",
          },
        },
      }
    )
  ).toStrictEqual({
    profile: {
      phoneNumber: "1111111111",
      address: {
        state: "CA",
      },
      company: {
        taxId: "12345",
      },
    },
  });
});

// Arrays

test("array with nothing changed", () => {
  expect(getDifference([1, 2, 3, 4, 5], [1, 2, 3, 4, 5])).toStrictEqual(
    undefined
  );
});

test("array with first item deleted", () => {
  expect(getDifference([1, 2, 3, 4, 5], [null, 2, 3, 4, 5])).toStrictEqual([
    null,
    2,
    3,
    4,
    5,
  ]);
});

test("array with last item deleted", () => {
  expect(getDifference([1, 2, 3, 4, 5], [1, 2, 3, 4, null])).toStrictEqual([
    1,
    2,
    3,
    4,
    null,
  ]);
});

test("array with new item added", () => {
  expect(getDifference([1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6])).toStrictEqual([
    1, 2, 3, 4, 5, 6,
  ]);
});

test("array with new item added and some items deleted", () => {
  expect(
    getDifference([1, 2, 3, 4, 5], [1, null, 3, null, 5, 6])
  ).toStrictEqual([1, null, 3, null, 5, 6]);
});

test("array of objects with nothing changed", () => {
  expect(
    getDifference(
      [
        {
          id: 1,
          status: "Pending",
        },
        {
          id: 2,
          status: "Pending",
        },
        {
          id: 3,
          status: "Pending",
        },
        {
          id: 4,
          status: "Pending",
        },
        {
          id: 5,
          status: "Pending",
        },
      ],
      [
        {
          id: 1,
          status: "Pending",
        },
        {
          id: 2,
          status: "Pending",
        },
        {
          id: 3,
          status: "Pending",
        },
        {
          id: 4,
          status: "Pending",
        },
        {
          id: 5,
          status: "Pending",
        },
      ]
    )
  ).toStrictEqual(undefined);
});

test("array of objects with first item changed", () => {
  expect(
    getDifference(
      [
        {
          id: 1,
          status: "Pending",
        },
        {
          id: 2,
          status: "Pending",
        },
        {
          id: 3,
          status: "Pending",
        },
        {
          id: 4,
          status: "Pending",
        },
        {
          id: 5,
          status: "Pending",
        },
      ],
      [
        {
          id: 1,
          status: "Completed",
        },
        {
          id: 2,
          status: "Pending",
        },
        {
          id: 3,
          status: "Pending",
        },
        {
          id: 4,
          status: "Completed",
        },
        {
          id: 5,
          status: "Pending",
        },
        {
          id: 6,
          status: "New",
        },
      ]
    )
  ).toStrictEqual([
    {
      status: "Completed",
    },
    {},
    {},
    { status: "Completed" },
    {},
    { id: 6, status: "New" },
  ]);
});
