/**
 * Retrieve detailed information of a list of Gmail threads from the Users API.
 *
 * @param {gmail_v1.Gmail} service - The Gmail API service object.
 * @param {gmail_v1.Schema$ListThreadsResponse.threads} threads - A list of Gmail thread objects.
 * @returns {gmail_v1.Resource$Users.threads[]} - A list of Gmail thread objects containing detailed information.
 *
 */
const retrieveThreads = async (service, threads) => {
  const threadObjs = await Promise.all(
    threads.map((thread) => {
      return service.users.threads.get({
        userId: "me",
        id: thread.id,
      });
    })
  );
  return threadObjs;
};

/**
 * Retrieves the email of the currently authenticated user from the Users API.
 *
 * @param {gmail_v1.Gmail} service - The Gmail API service object.
 * @returns {string} - The email of the currently authenticated user.
 *
 */
const getUserEmail = async (service) => {
  const res = await service.users.getProfile({ userId: "me" });
  return res.data.emailAddress;
};

/**
 * Parses a list of Gmail threads and returns a non-unique list of all participants in threads with more than 1 message.
 *
 * @param {gmail_v1.Resource$Users.threads[]} threads - A list of Gmail thread objects.
 * @returns {string[][]} - A non-unique list of all participants in threads with more than 1 message.
 * @throws {Error} - If an error occurs while parsing the participants.
 */
const parseThreadParticipants = (threads) => {
  // Filter out threads with less than 1 message.
  const exchanges = threads
    .filter((thread) => thread.data.messages.length > 1)
    .map((exchange) => exchange.data.messages);
  // Retrieve a list of all participants in the thread.
  const participants = exchanges.map((messages) => {
    const email_senders = messages.map((message) => {
      const email_sender = message.payload.headers.filter(
        (header) => header.name == "From"
      )[0].value;
      return email_sender;
    });
    return email_senders;
  });
  return participants;
};

/**
 * Retrieve unique participants from threads, excluding the user.
 *
 * @param {string} userEmail - The email address of the user.
 * @param {string[][]} threads - An array of arrays, where each subarray contains email addresses of participants in a single thread.
 *
 * @return {string[][]} An array of arrays, where each subarray contains unique email addresses of participants in a single thread, excluding the user's email.
 */
const retrieveUniqueParticipants = (userEmail, threads) => {
  const unique_emails = threads.map((thread) => {
    const non_unique_contacts = thread.filter(
      (sender) => !sender.includes(userEmail)
    );
    return [...new Set(non_unique_contacts)];
  });
  return unique_emails;
};

module.exports = {
  retrieveThreads,
  parseThreadParticipants,
  getUserEmail,
  retrieveUniqueParticipants,
};
