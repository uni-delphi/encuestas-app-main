"use client";
import React from "react";
import CsvDownloader from "react-csv-downloader";

export default function DescargarCsv({ props }: { props: any}) {
  
  return (
    <CsvDownloader
      filename={`survey-data-` + new Date().toISOString()}
      extension=".csv"
      separator=";"
      //wrapColumnChar=","
      columns={props.headers}
      datas={props.data}
      text="Descargar csv"
      className="bg-white border text-blue-600 hover:bg-gray-200 my-4 py-2.5 px-4 text-sm font-bold rounded-sm"
    />
  );
}
