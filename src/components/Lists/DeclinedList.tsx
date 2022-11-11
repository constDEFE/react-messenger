import RequestItem from "./RequestItem";
import { Style } from "../../models/models";
import React from "react";

interface DeclinedListProps {
  data: string[];
}

const styles: Style = {
  container: "rounded-div w-[480px] flex flex-col gap-4",
  heading: "text-xl font-semibold",
  divider: "-mx-2 mt-2 border-[#505050]",
  empty: "flex items-end justify-center",
};

const DeclinedList = ({ data }: DeclinedListProps) => {
  return (
    <div className={styles.container}>
      <header>
        <h2 className={styles.heading}>Declined Requests</h2>
        <hr className={styles.divider} />
      </header>
      {data.length ? data.map((uid) => <RequestItem declined={true} key={`${uid}DECLINED_ID`} uid={uid} />) : (
        <div className={styles.empty}>
          <h3>You don't have any requests.</h3>
        </div>
      )}
    </div>
  );
};

export default DeclinedList;
