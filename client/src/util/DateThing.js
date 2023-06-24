// import { useState, useRef, useEffect } from "react";
// import { Calendar, DateRange } from "react-date-range";
// import format from "date-fns/format";
// import "react-date-range/dist/styles.css"; // main style file
// import "react-date-range/dist/theme/default.css"; // theme css file

// const DateThing = () => {
//   const [calendar, setCalendar] = useState("");

//   const [open, setOpen] = useState(false);

//   const handleSelect = (date) => {
//     setCalendar(format(date, "yyyy-MM-dd"));
//   };

//   useEffect(() => {
//     setCalendar(format(new Date(), "yyyy-MM-dd"));
//     document.addEventListener("keydown", hideOnEscape, true);
//     document.addEventListener("click", hideOnClickOutside, true);
//   }, []);

//   const hideOnEscape = (e) => {
//     if (e.key === "Escape") {
//       setOpen(false);
//     }
//   };

//   // get target element to toggle
//   const refOne = useRef(null);

//   const hideOnClickOutside = (e) => {
//     if (refOne.current && !refOne.current.contains(e.target)) {
//       setOpen(false);
//     }
//   };

//   return (
//     <div className="calendarWrap">
//       <input
//         onClick={() => setOpen((open) => !open)}
//         value={calendar}
//         className="inputBox"
//       />

//       <div ref={refOne}>
//         {open && (
//           <Calendar
//             date={new Date()}
//             onChange={handleSelect}
//             className="calendarElement"
//           />
//         )}
//       </div>
//     </div>
//   );

//   //     const [state, setState] = useState([
//   //         {
//   //           startDate: new Date(),
//   //           endDate: null,
//   //           key: "selection",
//   //         },
//   //       ]);
//   //       <div className="calendarWrap">
//   //   <DateRange
//   //     editableDateInputs={true}
//   //     onChange={(item) => setState([item.selection])}
//   //     moveRangeOnFirstSelection={false}
//   //     ranges={state}
//   //     className="calendarElement"
//   //   />;
//   //   </div>
// };

// export default DateThing;
