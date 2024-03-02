import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dtos';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
    app.listen(3000);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3000');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'testing@e2e.com',
      password: 'test123',
    };
    describe('Sign Up', () => {
      it('Should throw error if no email is provided', () => {
        return pactum
          .spec()
          .post('/signup')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });
      it('Should throw error if no password is provided', () => {
        return pactum
          .spec()
          .post('/signup')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('Should throw error if no body is provided', () => {
        return pactum.spec().post('/signup').expectStatus(400);
      });
      it('Should sign up', () => {
        return pactum.spec().post('/signup').withBody(dto).expectStatus(201);
      });
    });
    describe('Sign In', () => {
      it('Should throw error if no email is provided', () => {
        return pactum
          .spec()
          .post('/signin')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });
      it('Should throw error if no password is provided', () => {
        return pactum
          .spec()
          .post('/signin')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('Should throw error if no body is provided', () => {
        return pactum.spec().post('/signin').expectStatus(400);
      });
      it('Should sign in', () => {
        return pactum
          .spec()
          .post('/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('UserAccessToken', 'access_token');
      });
    });
  });
  describe('Users', () => {
    it('Should return logged user', () => {
      return pactum
        .spec()
        .get('/users/me')
        .withHeaders({
          Authorization: 'Bearer $S{UserAccessToken}',
        })
        .expectStatus(200)
        .inspect();
    });
    it('Should edit user', () => {
      const dto: EditUserDto = {
        email: 'test2@e2e.com',
        firstName: 'Tester1',
      };
      return pactum
        .spec()
        .patch('/users/update')
        .withHeaders({
          Authorization: 'Bearer $S{UserAccessToken}',
        })
        .withBody(dto)
        .expectStatus(201)
        .inspect();
    });
  });

  describe('Bookmarks', () => {
    describe('Get Empty Bookmarks', () => {
      it('Should return empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{UserAccessToken} ' })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create Bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: 'First Bookmark',
        link: 'https://docs.nestjs.com/',
      };
      it('Should create a bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{UserAccessToken} ' })
          .withBody(dto)
          .expectStatus(201)
          .inspect()
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get Bookmarks', () => {
      it('Should return bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{UserAccessToken} ' })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get Bookmark By Id', () => {
      it('Should return bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{UserAccessToken} ' })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
      });
    });

    describe('Edit Bookmark By Id', () => {
      const dto: EditBookmarkDto = {
        description: 'Description added to this bookmark !',
      };
      it('Should update Bookmark by id', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{UserAccessToken} ' })
          .withBody(dto)
          .expectBodyContains(dto.description)
          .expectStatus(200);
      });
    });

    describe('Delete Bookmark By Id', () => {
      it('Should delete Bookmark by id', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{UserAccessToken} ' })
          .expectStatus(204);
      });
      it('Should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{UserAccessToken} ' })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
