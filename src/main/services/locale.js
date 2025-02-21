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
      contact: {
        title: 'Kontak',
        desc: 'Hanya melayani dihari kerja, <strong>(08.00 – 17.00) Senin – Jumat</strong>. Maaf bila sewaktu-waktu ada keterlambatan membalas pesan, karena yang membalas pesan adalah developer-nya langsung. Jika ada pertanyaan silahkan cek terlebih dahulu pada website kami.',
      },
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
    simpleConfigurationsApp: {
      warning: 'Pastikan menutup PES 2017 Kamu jika ingin menggunakan fitur Konfigurasi Sederhana!',
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
        licenseKeyInvalid: 'Kunci lisensi salah.',
        licenseKeyHasBeenUsed: 'Kunci lisensi telah digunakan.',
        mustUpgradeLicenseKey: 'Kunci lisensi yang digunakan saat ini tidak bisa digunakan untuk versi aplikasi ini.',
        mustUpgradeLicenseKeyForm: 'Kunci lisensi tidak bisa digunakan untuk versi aplikasi ini.',
        tryAgain: 'Terjadi masalah, silahkan coba lagi!',
      },
      keyLabelText: 'Kunci lisensi',
      keyTextareaPlaceholder: 'Masukkan kunci lisensi',
      keySmallText: 'Pastikan kamu terhubung ke Internet. Jika terjadi masalah, silahkan hubungi kontak yang tertera pada menu Bantuan \u00bb Tentang.',
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
      directorySmallText: 'Silahkan pilih atau masukkan lokasi direktori di mana kamu menginstall PES 2017.',
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
    advancedConfigBtnText: 'Lanjutan',
    simpleConfigBtnText: 'Sederhana',
    simpleAdvancedSmallText: '<strong>Sederhana</strong> untuk konfigurasi sederhana Addon, <strong>Lanjutan</strong> untuk konfigurasi detail dari Addon.',
    footer: {
      sendFeedbackText: 'Punya saran? ',
      sendFeedbackLinkText: 'Kirimkan masukan!'
    },
    notification: {
      title: 'Pembaruan Sider Manager tersedia!',
      body: 'Sider Manager versi :param diliris.',
    },
    addonInitializationApp: {
      smallText: '<strong>Catatan</strong>: Inisialisasi Addon hanya perlu dilakukan ketika pertama kali install aplikasi, kecuali jika memang ada intruksi untuk melakukannya lagi!, pastikan juga nama PES Executable dan Sider Executable benar pada bagian <strong>Pengaturan</strong> dan untuk berkas Sider yang lama akan dibackup di ',
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
    simpleConfigurationsMLManager: {
      desc: 'Pilih manager tim yang ingin kamu gunakan ketika memainkan Master League.',
      statusOn: 'Hidup',
      statusOff: 'Mati',
      addMLManagerBtnText: 'Tambah',
      successAlertMsg: {
        choosed: 'ML Manager berhasil dipilih.',
        changed: 'ML Manager berhasil diubah.',
      },
      successDeleteAlertMsg: 'ML Manager berhasil dihapus.',
    },
    simpleConfigurationsGraphicsMenu: {
      desc: 'Pilih Graphic Menu yang ingin kamu gunakan.',
      statusOn: 'Hidup',
      statusOff: 'Mati',
      addGraphicMenuBtnText: 'Tambah',
      successAlertMsg: {
        choosed: 'Graphic Menu berhasil dipilih.',
        changed: 'Graphic Menu berhasil diubah.',
      },
      successDeleteAlertMsg: 'Graphic Menu berhasil dihapus.',
    },
    simpleConfigurationsPressRoom: {
      desc: 'Pilih Press Room yang ingin kamu gunakan.',
      statusOn: 'Hidup',
      statusOff: 'Mati',
      addPressRoomBtnText: 'Tambah',
      successAlertMsg: {
        choosed: 'Press Room berhasil dipilih.',
        changed: 'Press Room berhasil diubah.',
      },
      successDeleteAlertMsg: 'Press Room berhasil dihapus.',
    },
    modalWithSimpleConfigForm: {
      dialogTitle: 'Pilih direktori :param baru yang ingin ditambahkan.',
      errorAlertMsgWithCpk: ':param salah. Pastikan setelah nama direktori adalah direktori common (contoh: <strong>Reza Fikkri\\common</strong>) dan pastikan di dalam direktori common tidak terdapat file .cpk!',
      errorAlertMsgWithoutCpk: ':param salah. Pastikan setelah nama direktori adalah direktori common (contoh: <strong>Reza Fikkri\\common</strong>)!',
      successAlertMsg: ':param berhasil ditambahkan.',
      directoryLabelText: 'Direktori',
      directoryInputPlaceholder: 'Masukkan direktori',
      directoryBtnText: 'Pilih',
      directorySmallText: 'Silahkan pilih lokasi direktori :param baru yang ingin ditambahkan.',
      nameLabelText: 'Nama',
      nameInputPlaceholder: 'Masukkan nama :param',
      previewSmallText: 'Jika ingin ada preview, sertakan file gambar berkestensi <strong>.png</strong> atau <strong>.jpg</strong> pada direktori :param.',
      submitBtnText: 'Simpan',
    },
    modalPrompt: {
      msgPrefix: 'Apakah kamu yakin ingin menghapus',
      msgEnding: 'akan dihapus secara permananen.',
      yesBtnText: 'Ya, saya yakin',
      cancelBtnText: 'Tidak, batal',
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
      contact: {
        title: 'Contact',
        desc: 'Only serve on weekdays, <strong>(8AM - 5PM), Monday - Friday</strong>. Sorry if at any time there is a delay in replying to messages, because the one who replies to messages is the developer directly. If you have any questions, please check our website first.',
      },
    },
    addonInitializationWindow: {
      title: 'Addon Initialization - Sider Manager',
    },
    simpleConfigurationsWindow: {
      title: 'Simple Configurations - Sider Manager',
    },
    simpleConfigurationsApp: {
      warning: 'Make sure to close your PES 2017 if you want to use the Simple Configuration feature!',
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
        licenseKeyInvalid: 'License key is incorrect.',
        licenseKeyHasBeenUsed: 'License key has been used.',
        mustUpgradeLicenseKey: 'The currently used license key cannot be used for this version of application.',
        mustUpgradeLicenseKeyForm: 'License key cannot be used for this version of application.',
        tryAgain: 'A problem occurred, please try again!',
      },
      keyLabelText: 'License key',
      keyTextareaPlaceholder: 'Enter the license key',
      keySmallText: 'Make sure you are connected to the Internet. If problems occur, please contact the contact listed in the Help \u00bb About menu.',
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
      directorySmallText: 'Please choose or enter the directory location where you installed PES 2017.',
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
    advancedConfigBtnText: 'Advanced',
    simpleConfigBtnText: 'Simple',
    simpleAdvancedSmallText: '<strong>Simple</strong> for simple configurations of Addon, <strong>Advanced</strong> for detail configurations of Addon.',
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
      smallText: '<strong>Note</strong>: Addon initialization only needs to be done when first installing the application, unless there are instructions to do it again!, also make sure the PES Executable name and Sider Executable name are correct in <strong>Setting</strong> section and for old Sider file will be backed up in ',
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
    simpleConfigurationsMLManager: {
      desc: 'Choose team manager that you want to use when play Master League.',
      statusOn: 'On',
      statusOff: 'Off',
      addMLManagerBtnText: 'Add',
      successAlertMsg: {
        choosed: 'ML Manager successfully choosed.',
        changed: 'ML Manager successfully changed.',
      },
      successDeleteAlertMsg: 'ML Manager successfully deleted.',
    },
    simpleConfigurationsGraphicsMenu: {
      desc: 'Choose Graphic Menu that you want to use.',
      statusOn: 'On',
      statusOff: 'Off',
      addGraphicMenuBtnText: 'Add',
      successAlertMsg: {
        choosed: 'Graphic Menu successfully choosed.',
        changed: 'Graphic Menu successfully changed.',
      },
      successDeleteAlertMsg: 'Graphic Menu successfully deleted.',
    },
    simpleConfigurationsPressRoom: {
      desc: 'Choose Press Room that you want to use.',
      statusOn: 'On',
      statusOff: 'Off',
      addPressRoomBtnText: 'Add',
      successAlertMsg: {
        choosed: 'Press Room successfully choosed.',
        changed: 'Press Room successfully changed.',
      },
      successDeleteAlertMsg: 'Press Room successfully deleted.',
    },

    modalWithSimpleConfigForm: {
      dialogTitle: 'Choose new :param directory you want to add.',
      errorAlertMsgWithCpk: ':param wrong. Make sure after directory name is common directory (example: <strong>Reza Fikkri\\common</strong>) and make sure in common directory no .cpk file!',
      errorAlertMsgWithoutCpk: ':param wrong. Make sure after directory name is common directory (example: <strong>Reza Fikkri\\common</strong>)!',
      successAlertMsg: ':param successfully added.',
      directoryLabelText: 'Directory',
      directoryInputPlaceholder: 'Enter the directory',
      directoryBtnText: 'Choose',
      directorySmallText: 'Please choose new :param location directory that you want to add.',
      nameLabelText: 'Name',
      nameInputPlaceholder: 'Enter the :param name',
      previewSmallText: 'If you want to add preview, include image file with extention <strong>.png</strong> or <strong>.jpg</strong> in :param directory.',
      submitBtnText: 'Save',
    },
    modalPrompt: {
      msgPrefix: 'Are you sure you want to delete',
      msgEnding: 'will be delete permanently.',
      yesBtnText: 'Yes, i\'m sure',
      cancelBtnText: 'No, cancel',
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
