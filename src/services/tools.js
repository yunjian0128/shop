import { showSuccessToast, showFailToast, showConfirmDialog } from 'vant';

export default {
  install(app)
  {
    app.config.globalProperties.$success = showSuccessToast;
    app.config.globalProperties.$fail = showFailToast;
    app.config.globalProperties.$confirm = showConfirmDialog;
  }
}