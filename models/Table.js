import mongoose from "mongoose";

const TableSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tableName: { type: String, required: true },
    columns: [
      {
        name: { type: String, required: true },
        type: { type: String, enum: ["text", "date"], required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Table || mongoose.model("Table", TableSchema);
