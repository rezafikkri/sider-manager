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
      title: 'Pengaturan - Sidar Manager',
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
  },

  en: {
    showSettingsWindowBtn: {
      title: 'Settings',
    },
    initializationsWindow: {
      title: 'Initializations - Sider Manager',
    },
    settingsWindow: {
      title: 'Settings - Sidar Manager',
    },
    aboutWindow: {
      title: 'About - Sider Manager',
      powered: 'Powered by',
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
