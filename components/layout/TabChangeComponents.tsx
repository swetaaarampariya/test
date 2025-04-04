"use client";

import ContactDetails from "../User_Management/ContactDetails";
import PersonalDetails from "../User_Management/PersonalDetails";
import RatingDetails from "../User_Management/RatingDetails";
import SessionDetails from "../User_Management/SessionDetails";
import Tabs from "./Tabs";

const TabChangeComponents = () => {
  const tabs = [
    { label: "Personal Details", content:<PersonalDetails/> },
    { label: "Contact Details", content: <ContactDetails/>},
    { label: "Session Details", content: <SessionDetails/> },
    { label: "Rating Details", content: <RatingDetails/>},
  ];

  return  <div className="bg-slate-100 space-y-6 p-6"><Tabs tabs={tabs} defaultTab={0} /></div>;
};

export default TabChangeComponents;
