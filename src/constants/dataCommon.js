export const AdminPhoneNumber = "0588.001.888";

// VietQR payment constants - fill in before deploying
export const VIETQR_BANK_ID = '970415';       // e.g. VCB, TCB, MB, ACB
export const VIETQR_ACCOUNT_NO = '109004822580';    // account number
export const VIETQR_TEMPLATE = 'compact2';  // compact | compact2 | qr_only | print
export const VIETQR_ACCOUNT_NAME = 'NGUYEN THI LONG';  // full account name (uppercase)
export const VIETQR_BANK_NAME = 'VietinBank';     // display bank name, e.g. Vietcombank
export const VIETQR_BUDGET_LIST = [50000, 100000, 200000, 500000]; // available top-up amounts (VND)

export const getVietQRUrl = (amount, description = '') =>
    `https://img.vietqr.io/image/${VIETQR_BANK_ID}-${VIETQR_ACCOUNT_NO}-${VIETQR_TEMPLATE}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(VIETQR_ACCOUNT_NAME)}`;