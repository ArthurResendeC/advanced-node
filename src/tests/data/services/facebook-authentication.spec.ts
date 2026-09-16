import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { FacebookAuthenticationService } from '@/data/services';
import { AuthenticationError } from '@/domain/errors';
import { describe, it, expect, mock, beforeEach } from 'bun:test';

const makeSut = () => {
  const loadFacebookUserApi = {
    loadUser: mock<LoadFacebookUserApi['loadUser']>(),
  };

  const sut = new FacebookAuthenticationService(loadFacebookUserApi);

  return { sut, loadFacebookUserApi };
};

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: LoadFacebookUserApi;
  let sut: FacebookAuthenticationService;

  beforeEach(() => {
    loadFacebookUserApi = {
      loadUser: mock<LoadFacebookUserApi['loadUser']>(),
    };

    sut = new FacebookAuthenticationService(loadFacebookUserApi);
  });

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token: 'any_token' });

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({
      token: 'any_token',
    });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const { loadFacebookUserApi } = makeSut();

    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);

    const sut = new FacebookAuthenticationService(loadFacebookUserApi);

    const authResult = await sut.perform({ token: 'any_token' });

    expect(authResult).toEqual(new AuthenticationError());
  });
});
