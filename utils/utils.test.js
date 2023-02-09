const {
  parseThreadParticipants,
  retrieveUniqueParticipants,
} = require("./utils");

describe("parseThreadParticipants", () => {
  let multiple_messages;
  let one_message;
  let no_message;

  beforeEach(() => {
    multiple_messages = [
      {
        data: {
          messages: [
            {
              payload: {
                headers: [
                  { name: "From", value: "alice@example.com" },
                  { name: "To", value: "bob@example.com" },
                ],
              },
            },
            {
              payload: {
                headers: [
                  { name: "From", value: "bob@example.com" },
                  { name: "To", value: "alice@example.com" },
                ],
              },
            },
          ],
        },
      },
      {
        data: {
          messages: [
            {
              payload: {
                headers: [
                  { name: "From", value: "eve@example.com" },
                  { name: "To", value: "alice@example.com" },
                ],
              },
            },
            {
              payload: {
                headers: [
                  { name: "From", value: "alice@example.com" },
                  { name: "To", value: "eve@example.com" },
                ],
              },
            },
            {
              payload: {
                headers: [
                  { name: "From", value: "eve@example.com" },
                  { name: "To", value: "alice@example.com" },
                ],
              },
            },
          ],
        },
      },
    ];
    one_message = [
      {
        data: {
          messages: [
            {
              payload: {
                headers: [
                  { name: "From", value: "charlie@example.com" },
                  { name: "To", value: "dave@example.com" },
                ],
              },
            },
          ],
        },
      },
    ];
    no_message = [
      {
        data: {
          messages: [],
        },
      },
    ];
  });

  it("should return a list of all participants in threads", () => {
    const participants = parseThreadParticipants(multiple_messages);
    expect(participants).toEqual([
      ["alice@example.com", "bob@example.com"],
      ["eve@example.com", "alice@example.com", "eve@example.com"],
    ]);
  });

  it("should return no participants in a thread with only one message", () => {
    const participants = parseThreadParticipants(one_message);
    expect(participants).toEqual([]);
  });

  it("should return no participants in a thread with no messages", () => {
    const participants = parseThreadParticipants(no_message);
    expect(participants).toEqual([]);
  });
});

describe("retrieveUniqueParticipants", () => {
  let userEmail;
  let threads;

  beforeEach(() => {
    userEmail = "testuser@example.com";
    threads = [
      [
        "testuser@example.com",
        "participant1@example.com",
        "participant2@example.com",
      ],
      ["testuser@example.com", "participant3@example.com"],
      [
        "testuser@example.com",
        "participant2@example.com",
        "participant3@example.com",
        "participant4@example.com",
      ],
    ];
  });

  it("should return an array of arrays of unique participant email addresses, excluding the user email", async () => {
    const result = retrieveUniqueParticipants(userEmail, threads);
    expect(result).toEqual([
      ["participant1@example.com", "participant2@example.com"],
      ["participant3@example.com"],
      [
        "participant2@example.com",
        "participant3@example.com",
        "participant4@example.com",
      ],
    ]);
  });

  it("should return an empty array for threads with no unique participants", async () => {
    threads = [["testuser@example.com"]];
    const result = retrieveUniqueParticipants(userEmail, threads);
    expect(result).toEqual([[]]);
  });

  it("should return an array of arrays of unique participant email addresses even if the same email appears multiple times in a thread", async () => {
    threads = [
      [
        "testuser@example.com",
        "participant1@example.com",
        "participant1@example.com",
      ],
      ["testuser@example.com", "participant2@example.com"],
    ];
    const result = retrieveUniqueParticipants(userEmail, threads);
    expect(result).toEqual([
      ["participant1@example.com"],
      ["participant2@example.com"],
    ]);
  });
});
