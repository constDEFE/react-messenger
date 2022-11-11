import RequestItem from "./RequestItem";
import { Style } from "../../models/models";
import React from "react";

interface RequestsListProps {
  data: string[];
}

const styles: Style = {
  container: "rounded-div w-[480px] flex flex-col gap-4",
  heading: "text-xl font-semibold",
  divider: "-mx-2 mt-2 border-[#505050]",
  empty: "flex items-end justify-center",
};

const RequestsList = ({ data }: RequestsListProps) => {
  return (
    <div className={styles.container}>
      <header>
        <h2 className={styles.heading}>Friend Requests</h2>
        <hr className={styles.divider} />
      </header>
      {data.length ? data.map((uid) => <RequestItem key={`${uid}REQUEST_ID`} uid={uid} />) : (
        <div className={styles.empty}>
          <h3>You don't have any requests.</h3>
        </div>
      )}
    </div>
  );
};

export default RequestsList;
