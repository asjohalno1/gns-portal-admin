import React from "react";
import Table from "../../Table/table";

const StafListing = ({ staffListdata }) => {
  return (
    <>
      <div className="">
        <Table data={staffListdata || []} mode="staffListing" />
      </div>
    </>
  );
};

export default StafListing;
