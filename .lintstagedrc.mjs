export default {
  '*.ts': () => ['bun run lint:fix', 'bun test --changed=HEAD'],
};
