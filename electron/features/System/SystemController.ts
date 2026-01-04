import { ipcMain, dialog } from "electron";
import { IController } from "../../shared/types";

export class SystemController implements IController {
  public initialize() {
    ipcMain.handle("system:open-file-dialog", async () => {
      const result = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [
          { name: "Images", extensions: ["jpg", "jpeg", "png", "gif", "webp", "svg"] },
        ],
      });

      if (result.canceled || result.filePaths.length === 0) {
        return null;
      }

      // In electron, filePaths contains absolute paths
      return "file://" + result.filePaths[0]; // Prepend file protocol for usage in CSS/img src
    });
  }
}
