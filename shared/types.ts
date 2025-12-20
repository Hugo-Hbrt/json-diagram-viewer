export interface VsCodeMessage {
  type: "update";
  content: string;
  filename: string;
}
