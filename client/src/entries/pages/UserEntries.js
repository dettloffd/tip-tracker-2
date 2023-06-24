import React from "react";
import EntryLog from "../components/EntryLog";
import { useQuery } from "react-query";
import { getAllEntries, getEntriesByUserId } from "../api/entriesApi";

const UserEntries = ({ numResults, dateRange }) => {
  let userId = "5f0aa38f2a9f992d74ff4533";
  /////testing purposes

  // const { data, error, isLoading, isError } = useQuery(
  //   ["userEntries", {userId}],
  //   (userId) => getEntriesByUserId(userId)
  // );
  ///////alternate syntax

  // const { data, error, isLoading, isError } = useQuery(
  //   ["userEntries", {userId}],
  //   getEntriesByUserId
  // );
  //////https://www.sitepoint.com/react-query-fetch-manage-data/

  const { data, error, isLoading, isError } = useQuery(
    "userEntries",
    getAllEntries
  );
  //////////////for testing; gets every entry in database

  if (isLoading) {
    return <p>hold on</p>;
  }

  if (isError) {
    // console.log(error);
    return <p>errorrrrrr</p>;
  }

  if (data) {
    let testEntries = data.data.entries.slice(-5, -1);

    return (
      <>
        <EntryLog numResults={numResults} dateRange={dateRange} />
        {/* <EntryLog entries={data.data.entries}></EntryLog> */}
      </>
    );
  }
};

export default UserEntries;

// {status && <p>holdddd onnnn</p>}
// {!isLoading && loadedEntries && (
//   <div>
//     {/* <h3>{status}</h3> */}
//     {/* <button onClick={updateEditedState}>pressdatboi</button> */}
//     <EntryLog

//       entries={loadedEntries}
//       // onDeleteEntry={entryDeleteHandler}
//       // onEditEntryRefresh={editRequest}
//     ></EntryLog>
//   </div>
// )}

// const editRequest = (editedEntry) => {
//   //mutate(editedEntry);

//   const editEntry = async () => {
//     try {
//       const response = await axios({
//         method: "PATCH",
//         url: `http://localhost:5000/api/entries/${editedEntry._id}`,
//         //url: `http://localhost:5000/api/entries/123`,
//         data: editedEntry,
//         headers: {},
//       });
//       console.log(response);
//       // if (response.data.success == true) {
//       //   const newLoadedEntries = loadedEntries.map((entry) => {
//       //     if (entry._id === editedEntry._id) {
//       //       const updatedEntry = editedEntry;
//       //       return updatedEntry;
//       //     }
//       //     return entry;
//       //   });
//       //   setLoadedEntries(newLoadedEntries);
//       // }
//     } catch (err) {
//       //console.log(errorMessage);
//     }

//   };
//   editEntry();
// };

// return (

//   <>

//      {entriesQuery.status.success && loadedEntries && (

//       <div>
//         <EntryLog
//           entries={entriesQuery.data.data.entries}
//         ></EntryLog>
//       </div>
//     )}
//   </>
// );
// };

// return (

//   <>

//      {entriesQuery.status.success && (

//       <div>
//         <EntryLog
//           entries={entriesQuery.data.data.entries}
//         ></EntryLog>
//       </div>
//     )}
//   </>
// );
// };
