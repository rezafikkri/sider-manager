import {
  writeFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
} from 'node:fs';
import { getSettingsFilePath, getSettingsPath } from './settings';
import path from 'node:path';

const resources = {
  id: {
    showSettingsWindowBtn: {
      title: 'Pengaturan',
    },
    initializationsWindow: {
      title: 'Inisialisasi - Sider Manager',
    },
    aboutWindow: {
      title: 'Tentang - Sider Manager',
      powered: 'Dipersembahkan oleh',
    },
    settingsWindow: {
      title: 'Pengaturan - Sider Manager',
    },
    addonInitializationWindow: {
      title: 'Inisialisasi Addon - Sider Manager',
    },
    simpleConfigurationsWindow: {
      title: 'Konfigurasi Sederhana - Sider Manager',
    },
    header: {
      toggleLocaleBtn: {
        title: 'Ubah bahasa ke bahasa Inggris',
      },
      toggleHelpBtn: {
        title: 'Bantuan',
      },
      helpMenu: {
        tutorText: 'Lihat tutorial',
        aboutText: 'Tentang',
      },
    },
    settingsForm: {
      error: {
        pesExe: 'Nama file executable PES tidak ada di dalam direktori instalasi PES 2017',
        siderExe: 'Nama file executable Sider tidak ada di dalam direktori instalasi PES 2017',
      },
      pesExeLabelText: 'Executable PES 2017',
      pesExeInputPlaceholder: 'Masukkan nama file executable PES',
      pesExeSmallText: 'Pastikan file executable PES berada di dalam direktori instalasi PES 2017.',
      siderExeLabelText: 'Executable Sider',
      siderExeInputPlaceholder: 'Masukkan nama file executable Sider',
      siderExeSmallText: 'Pastikan file executable Sider berada di dalam direktori instalasi PES 2017.',
      submitBtnText: 'Simpan',
      successAlertMsg: 'Pengaturan berhasil disimpan.',
    },
    activationForm: {
      error: {
        activationKeyInvalid: 'Kunci aktivasi salah.',
        activationKeyHasBeenUsed: 'Kunci aktivasi telah digunakan.',
        tryAgain: 'Terjadi masalah, silahkan coba lagi!',
      },
      keyLabelText: 'Kunci aktivasi',
      keyTextareaPlaceholder: 'Masukkan kunci aktivasi',
      keySmallText: 'Pastikan kamu terhubung ke Internet. Jika terjadi masalah, silahkan hubungi kontak yang tertera pada menu Bantuan \u00bb Tentang kami.',
      submitBtnText: 'Berikutnya',
      submitBtnLoadingText: 'Memvalidasi...',
    },
    pesDirectoryForm: {
      submitBtnText: 'Selesai',
    },
    pesDirectoryInput: {
      directoryLabelText: 'Direktori PES 2017',
      directoryInputPlaceholder: 'Masukkan direktori',
      chooseBtnText: 'Pilih',
      directorySmallText: 'Silahkan pilih atau masukkan direktori di mana kamu menginstall PES 2017.',
      dialogTitle: 'Pilih direktori PES 2017',
    },
    playGameBtn: {
      btnText: 'Bermain Game',
      error: {
        pesExeNotFound: 'Pada direktori instalasi PES 2017, tidak ditemukan file PES2017.exe, jika kamu pernah mengubah nama file PES2017.exe sebelumnya, kamu harus mengatur nama filenya pada menu Pengaturan!',
        siderExeNotFound: 'Pada direktori instalasi PES 2017, tidak ditemukan file sider.exe, pastikan kamu telah menginstall Addon melalui fitur Pasang Addon, atau jika kamu pernah mengubah nama file sider.exe, kamu harus mengatur nama filenya pada menu Pengaturan!',
        runApp: 'Terjadi kesalahan pada saat menjalankan aplikasi PES 2017 dan atau Sider.',
      },
    },
    addonInitializationBtn: {
      btnText: 'Inisialisasi Addon',
      smallText: 'Menginisialisasi Addon/Mod kamu dengan mudah',
    },
    advancedConfigBtn: {
      btnText: 'Lanjutan',
      smallText: 'Konfigurasi detail dari Addon kamu',
    },
    simpleConfigBtn: {
      btnText: 'Sederhana',
      smallText: 'Konfigurasi sederhana dari Addon kamu',
    },
    footer: {
      sendFeedbackText: 'Punya saran? ',
      sendFeedbackLinkText: 'Kirimkan masukan!'
    },
    notification: {
      title: 'Pembaruan Sider Manager tersedia!',
      body: 'Sider Manager versi :param diliris.',
    },
    addonInitializationApp: {
      smallStrongText: 'Catatan',
      smallText: 'berkas Sider yang lama akan dibackup di',
      cancelBtnText: 'Batal',
      initializationBtnText: 'Inisialisasi',
      successAlertMsg: 'Inisialisasi Addon selesai.',
      errorAlertMsg: 'Inisialisasi Addon gagal, silahkan coba lagi!',
    },
    addonInitializationChoose: {
      pChooseFileText1: 'Pilih berkas',
      pChooseFileText2: 'yang telah kamu unduh.',
      chooseFileBtnText: 'Pilih',
      dialogTitle: 'Pilih berkas addon-initialization.zip yang telah kamu unduh.',
    },
    simpleConfigurationsSider: {
      pText: 'Konfigurasi Sider kamu dengan mudah.',
      sectionPDesc1: 'Membuat Sider mengeluarkan beberapa informasi tambahan ke dalam file log <code>sider.log</code>. Tetapi harap diingat ini dapat memperlambat permainan.',
      sectionPDesc2: 'Mengaktifkan/menonaktifkan dukungan skrip.',
      sectionPDesc3: 'Mengaktifkan/menonaktifkan fungsionalitas LiveCPK dari Sider.',
      sectionPDesc5: 'Membuat Sider akan menutup sendiri, ketika keluar dari game.',
      sectionPDesc6: 'Membuat Sider akan mulai dengan jendela yang diperkecil.',
      sectionPDesc8: 'Memungkinkan gerakan bebas pengontrol. Biasanya, itu hanya mungkin dalam mode Exhibition, tetapi dengan mengaktifkan fitur ini, Anda juga dapat memindahkan pengontrol di mode kompetisi.',
      sectionPDesc9: 'Memungkinkan pengontrol pertama dipindahkan ke tengah, menonaktifkannya secara efektif.',
      sectionPDesc10: 'Matikan bilah hitam (<i>letterboxing</i>) di bagian atas dan bawah layar, atau di kiri/kanan.',
      sectionPDesc11: 'Mengaktifkan slider "Angle" untuk kamera "Dynamic Wide". Fitur ini agak eksperimental.',
      sectionPDesc12: 'Ini memungkinkan untuk memperluas jangkauan slider kamera: Zoom, Height, Angle. Saat ini, ini hanya berfungsi untuk kamera "Kustom". Setel ke <code>0</code> untuk menonaktifkan fitur ini.',
    },
  },

  en: {
    showSettingsWindowBtn: {
      title: 'Settings',
    },
    initializationsWindow: {
      title: 'Initializations - Sider Manager',
    },
    settingsWindow: {
      title: 'Settings - Sider Manager',
    },
    aboutWindow: {
      title: 'About - Sider Manager',
      powered: 'Powered by',
    },
    addonInitializationWindow: {
      title: 'Addon Initialization - Sider Manager',
    },
    simpleConfigurationsWindow: {
      title: 'Simple Configurations - Sider Manager',
    },
    header: {
      toggleLocaleBtn: {
        title: 'Change language to Indonesian',
      },
      toggleHelpBtn: {
        title: 'Help',
      },
      helpMenu: {
        tutorText: 'View tutorial',
        aboutText: 'About'
      },
    },
    settingsForm: {
      error: {
        pesExe: 'The PES executable file name is not present in the PES 2017 installation directory',
        siderExe: 'The Sider executable file name is not present in the PES 2017 installation directory',
      },
      pesExeLabelText: 'PES 2017 executable',
      pesExeInputPlaceholder: 'Enter the name of the PES executable file',
      pesExeSmallText: 'Make sure the PES executable file is in the PES 2017 installation directory.',
      siderExeLabelText: 'Sider executable',
      siderExeInputPlaceholder: 'Enter the name of the Sider executable file',
      siderExeSmallText: 'Make sure the Sider executable file is in the PES 2017 installation directory.',
      submitBtnText: 'Save',
      successAlertMsg: 'Settings successfully saved.',
    },
    activationForm: {
      error: {
        activationKeyInvalid: 'Activation key is incorrect.',
        activationKeyHasBeenUsed: 'Activation key has been used.',
        tryAgain: 'A problem occurred, please try again!',
      },
      keyLabelText: 'Activation key',
      keyTextareaPlaceholder: 'Enter the activation key',
      keySmallText: 'Make sure you are connected to the Internet. If problems occur, please contact the contact listed in the Help \u00bb About us menu.',
      submitBtnText: 'Next',
      submitBtnLoadingText: 'Validating...',
    },
    pesDirectoryForm: {
      submitBtnText: 'Finish',
    },
    pesDirectoryInput: {
      directoryLabelText: 'PES 2017 Directory',
      directoryInputPlaceholder: 'Enter the directory',
      chooseBtnText: 'Choose',
      directorySmallText: 'Please choose or enter the directory where you installed PES 2017.',
      dialogTitle: 'Choose the PES 2017 directory',
    },
    playGameBtn: {
      btnText: 'Play Game',
      error: {
        pesExeNotFound: 'In the PES 2017 installation directory, the PES2017.exe file is not found, if you have previously changed the name of the PES2017.exe file, you must set the file name in the Settings menu!',
        siderExeNotFound: 'In the PES 2017 installation directory, the sider.exe file is not found, Make sure you have installed the Addon via the Install Addon feature, or if you have previously changed the name of the sider.exe file, you must set the file name in the Settings menu!',
        runApp: 'An error occurred while running the PES 2017 and or Sider application.',
      },
    },
    addonInitializationBtn: {
      btnText: 'Addon Initialization',
      smallText: 'Initialize your Addon/Mod easily',
    },
    advancedConfigBtn: {
      btnText: 'Advanced',
      smallText: 'Detailed configuration of your Addon',
    },
    simpleConfigBtn: {
      btnText: 'Simple',
      smallText: 'Simple configuration of your Addon',
    },
    footer: {
      sendFeedbackText: 'Have a suggestion? ',
      sendFeedbackLinkText: 'Send feedback!'
    },
    notification: {
      title: 'Sider Manager update available!',
      body: 'Sider Manager version :param released.',
    },
    addonInitializationApp: {
      smallStrongText: 'Note',
      smallText: 'old Sider file will be backed up in',
      cancelBtnText: 'Cancel',
      initializationBtnText: 'Initialization',
      successAlertMsg: 'Addon initialization complete.',
      errorAlertMsg: 'Addon initialization failed, please try again!',
    },
    addonInitializationChoose: {
      pChooseFileText1: 'Choose',
      pChooseFileText2: 'file that you have downloaded.',
      chooseFileBtnText: 'Choose',
      dialogTitle: 'Choose addon-initialization.zip file that have you downloaded.',
    },
    simpleConfigurationsSider: {
      pText: 'Config your Sider easyly.',
      sectionPDesc1: 'Make Sider output some additional information to the log file <code>sider.log</code>. But be aware that this may slow down the game.',
      sectionPDesc2: 'Enable/disable scripting support.',
      sectionPDesc3: 'Enable/disable LiveCPK functionality from Sider.',
      sectionPDesc5: 'Make Sider will close itself, when existing the game.',
      sectionPDesc6: 'Make Sider will start a minimized window.',
      sectionPDesc8: 'Allows free movement of the controller. Normally, this is only possible in Exhibition mode, but by enabling this feature, you can also move the controller in competition mode.',
      sectionPDesc9: 'Allows first controller moved to center, disabling it effectively.',
      sectionPDesc10: 'Turn off the black bar (<i>letterboxing</i>) at the top and bottom of the screen, or left/right.',
      sectionPDesc11: 'Enable "Angle" slider for "Dynamic Wide" camera. This feature is somewhat experimental.',
      sectionPDesc12: 'Allows to extend the range of camera sliders: Zoom, Height, Angle. Currently, it only works for "Custom" camera. Set to <code>0</code> for disable this feature.',
    },
  },
};

function initializeLocale() {
  const localePath = path.join(getSettingsPath(), 'locale');
  if (!existsSync(localePath)) {
    mkdirSync(localePath, { recursive: true });
  }

  const settingsFilePath = getSettingsFilePath();
  if (!existsSync(settingsFilePath)) {
    writeFileSync(settingsFilePath, JSON.stringify({locale:'id'}));
  }

  const idLocalePath = path.join(localePath, 'id.json');
  const enLocalePath = path.join(localePath, 'en.json');
  if (!existsSync(idLocalePath)) {
    writeFileSync(idLocalePath, JSON.stringify(resources.id));
  }
  if (!existsSync(enLocalePath)) {
    writeFileSync(enLocalePath, JSON.stringify(resources.en));
  }
}

function getLocaleResources() {
  const localePath = path.join(getSettingsPath(), 'locale');

  return {
    id: JSON.parse(readFileSync(path.join(localePath, 'id.json'))),
    en: JSON.parse(readFileSync(path.join(localePath, 'en.json'))),
  };
}

export {
  resources,
  initializeLocale,
  getLocaleResources,
};
