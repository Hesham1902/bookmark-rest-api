/* eslint-disable */
export default async () => {
  const t = {};
  return {
    '@nestjs/swagger': {
      models: [
        [
          import('./auth/dtos/auth.dto'),
          {
            AuthDto: {
              email: { required: true, type: () => String },
              password: { required: true, type: () => String },
            },
          },
        ],
        [
          import('./user/dto/edit-user.dto'),
          {
            EditUserDto: {
              email: { required: false, type: () => String },
              firstName: { required: false, type: () => String },
              lastName: { required: false, type: () => String },
            },
          },
        ],
        [
          import('./bookmark/dto/create-bookmark.dto'),
          {
            CreateBookmarkDto: {
              title: { required: true, type: () => String },
              description: { required: false, type: () => String },
              link: { required: true, type: () => String },
            },
          },
        ],
        [
          import('./bookmark/dto/edit-bookmark.dto'),
          {
            EditBookmarkDto: {
              title: { required: false, type: () => String },
              description: { required: false, type: () => String },
              link: { required: false, type: () => String },
            },
          },
        ],
      ],
      controllers: [
        [
          import('./auth/auth.controller'),
          { AuthController: { signup: {}, signin: {} } },
        ],
        [
          import('./user/user.controller'),
          { UserController: { getMe: {}, updateUser: {} } },
        ],
        [
          import('./bookmark/bookmark.controller'),
          {
            BookmarkController: {
              getBookmarks: {},
              getBookmarkById: {},
              createBookmark: {},
              editBookmarkById: {},
              deleteBookmarkById: {},
            },
          },
        ],
      ],
    },
  };
};
