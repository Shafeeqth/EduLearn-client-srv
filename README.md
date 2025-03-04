# Client Service

This is the client service for the EduLearn project. It is built using Next.js, React, and TypeScript, and is configured with ESLint and Prettier for code quality and formatting.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (>= 14.x)
- npm (>= 6.x)
- Git

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-repo/edulearn.git
   cd edulearn/client
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Initialize Husky:

   ```sh
   npx husky install
   ```

### Running the Development Server

To start the development server, run:

```sh
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

To build the project for production, run:

```sh
npm run build
```

This will create an optimized production build in the `.next` directory.

### Running Tests

To run tests, use:

```sh
npm test
```

### Linting and Formatting

To check for linting errors, run:

```sh
npm run lint
```

To format the code using Prettier, run:

```sh
npm run format
```

## Husky Hooks

This project uses Husky to manage Git hooks.

- **pre-commit**: Runs ESLint and Prettier checks before committing.
- **pre-push**: Runs tests before pushing.
- **commit-msg**: Enforces conventional commit messages.

## ESLint Configuration

The ESLint configuration is located in `eslint.config.mjs`. It extends several recommended configurations and includes settings for React and TypeScript.

## Contributing

Contributions are welcome! Please follow the [code of conduct](../CODE_OF_CONDUCT.md) and open an issue or pull request for any changes.

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for more information.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
