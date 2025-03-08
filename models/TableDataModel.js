import mongoose from "mongoose";

const TableDataSchema = new mongoose.Schema(
  {
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true , index:true},
    rows: [
      {
        data: { type: Object, required: true }, // Flexible JSON object to handle any column
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.TableData || mongoose.model("TableData", TableDataSchema);
