import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos';
import { FacebookAuthenticationService } from '@/data/services';
import { AuthenticationError } from '@/domain/errors';
import { describe, it, expect, mock, beforeEach, type Mock } from 'bun:test';

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: { loadUser: Mock<LoadFacebookUserApi['loadUser']> };
  let loadUserAccountRepo: { load: Mock<LoadUserAccountRepository['load']> };
  let createFacebookAccountRepo: { createFromFacebook: Mock<CreateFacebookAccountRepository['createFromFacebook']> };

  let sut: FacebookAuthenticationService;
  const token = 'any_token';

  beforeEach(() => {
    loadFacebookUserApi = {
      loadUser: mock<LoadFacebookUserApi['loadUser']>(),
    };
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id',
    });
    loadUserAccountRepo = {
      load: mock<LoadUserAccountRepository['load']>(),
    };

    createFacebookAccountRepo = {
      createFromFacebook: mock<CreateFacebookAccountRepository['createFromFacebook']>(),
    };

    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepo,
      createFacebookAccountRepo,
    );
  });

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token });

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({
      token,
    });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token });

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({
      email: 'any_fb_email',
    });
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1);
  });

  it('teste novo', async () => {
    loadUserAccountRepo.load.mockResolvedValueOnce(undefined);

    await sut.perform({ token });

    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id',
    });
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1);
  });
});
