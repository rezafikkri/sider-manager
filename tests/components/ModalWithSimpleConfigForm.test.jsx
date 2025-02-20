// @vitest-environment jsdom

import { describe, vi, it, expect, beforeAll, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';
import Locale from '../../src/renderer/src/components/Locale';
import ModalWithSimpleConfigForm from '../../src/renderer/src/components/ModalWithSimpleConfigForm';
import path from 'node:path';
import url from 'node:url';
import { translate } from '../../src/main/utils';

expect.extend(matchers);

const resources = {
  id: {
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
  },
};

function renderModalWithSimpleConfigForm(category, onSubmit, getPreview) {
  render(
    <Locale
      getResources={async () => resources}
      getSettings={async () => ({locale: 'id'})}
      saveSettings={async () => {}}
    >
      <ModalWithSimpleConfigForm
        category={category}
        onClose={() => {}}
        onSubmit={onSubmit}
        getPreview={getPreview}
      />
    </Locale>
  );
}

describe('ModalWithSimpleConfigForm component', () => {
  beforeAll(() => {
    window.sm = {
      chooseNewSimpleConfigDirectory: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should call chooseNewSimpleConfigDirectory and getPreview function correctly and show name and directory of choosed directory when choose directory button clicked', async () => {
    const onSubmit = () => {};
    const getPreview = vi.fn();
    renderModalWithSimpleConfigForm('ML Manager', onSubmit, getPreview);
    const directoryObj = {
      name: 'directory Manager',
      directory: path.join('others', 'directory Manager'),
      preview: url.pathToFileURL(path.join('others', 'directory Manager', 'preview.jpg')).toString(),
    };
    window.sm.chooseNewSimpleConfigDirectory.mockReturnValue(directoryObj);
    const chooseDirectoryBtn = await screen.findByTestId('choose-directory-btn');

    await userEvent.click(chooseDirectoryBtn);

    const dialogTitle = translate('id', 'modalWithSimpleConfigForm.dialogTitle', resources, 'ML Manager');
    expect(window.sm.chooseNewSimpleConfigDirectory)
      .toHaveBeenCalledWith(dialogTitle);
    expect(getPreview).toHaveBeenCalledWith(directoryObj.preview);
    const nameInputPlaceholder = translate('id', 'modalWithSimpleConfigForm.nameInputPlaceholder', resources, 'ML Manager');
    const nameInput = await screen
      .findByPlaceholderText(nameInputPlaceholder);
    expect(nameInput).toHaveValue(directoryObj.name);
    const directoryInput = await screen
      .findByPlaceholderText(resources.id.modalWithSimpleConfigForm.directoryInputPlaceholder);
    expect(directoryInput).toHaveValue(directoryObj.directory);
  });

  it('should not call onSubmit function when submit button clicked and form is empty', async () => {
    const onSubmit = vi.fn();
    const getPreview = () => {};
    renderModalWithSimpleConfigForm('Graphcis Menu', onSubmit, getPreview);
    const submitBtn = await screen.findByTestId('submit-btn');

    await userEvent.click(submitBtn);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should show loading, call onSUbmit function correctly, show success alert and reset form when submit button clicked and add data is success', async () => {
    const onSubmit = vi.fn().mockReturnValue(new Promise((resolve) => {
      setTimeout(() => resolve(true), 800);
    }));
    const getPreview = () => {};
    renderModalWithSimpleConfigForm('ML Manager', onSubmit, getPreview);
    const directoryObj = {
      name: 'ML Manager new',
      directory: path.join('others', 'ML Manager new'),
      preview: url.pathToFileURL(path.join('others', 'ML Manager new', 'preview.jpg')).toString(),
    };
    window.sm.chooseNewSimpleConfigDirectory.mockReturnValue(directoryObj);
    const chooseDirectoryBtn = await screen.findByTestId('choose-directory-btn');
    const submitBtn = await screen.findByTestId('submit-btn');

    await userEvent.click(chooseDirectoryBtn);

    const nameInputPlaceholder = translate('id', 'modalWithSimpleConfigForm.nameInputPlaceholder', resources, 'ML Manager');
    const nameInput = await screen
      .findByPlaceholderText(nameInputPlaceholder);
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Reza Fikkri');

    await userEvent.click(submitBtn);

    const loading = await screen.findByTestId('loading');
    expect(loading).toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledWith('Reza Fikkri', directoryObj.directory);

    await waitFor(async () => {
      expect(nameInput).toHaveValue('');
      const directoryInput = await screen
        .findByPlaceholderText(resources.id.modalWithSimpleConfigForm.directoryInputPlaceholder);
      expect(directoryInput).toHaveValue('');
      const successAlertEl = await screen.findByTestId('modal-with-simple-config-form-success-alert');
      expect(successAlertEl).toBeInTheDocument();
    });
  });

  it('should show error alert and not reset form submit when submit button clicked and add data is failed', async () => {
    const onSubmit = vi.fn().mockResolvedValue((false));
    const getPreview = () => {};
    renderModalWithSimpleConfigForm('Press Room', onSubmit, getPreview);
    const directoryObj = {
      name: 'Pess Room new yes',
      directory: path.join('others', 'Press Room new yes'),
      preview: url.pathToFileURL(path.join('others', 'Press Room new yes', 'preview.jpg')).toString(),
    };
    window.sm.chooseNewSimpleConfigDirectory.mockReturnValue(directoryObj);
    const chooseDirectoryBtn = await screen.findByTestId('choose-directory-btn');
    const submitBtn = await screen.findByTestId('submit-btn');

    await userEvent.click(chooseDirectoryBtn);

    const nameInputPlaceholder = translate('id', 'modalWithSimpleConfigForm.nameInputPlaceholder', resources, 'Press Room');
    const nameInput = await screen
      .findByPlaceholderText(nameInputPlaceholder);
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Reza Fikkri');

    await userEvent.click(submitBtn);

    expect(nameInput).toHaveValue('Reza Fikkri');
    const directoryInput = await screen
      .findByPlaceholderText(resources.id.modalWithSimpleConfigForm.directoryInputPlaceholder);
    expect(directoryInput).toHaveValue(directoryObj.directory);
    const errorAlertEl = await screen.findByTestId('modal-with-simple-config-form-error-alert');
    expect(errorAlertEl).toBeInTheDocument();
  });
});
