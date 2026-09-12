import { loginWithSecret } from "@/app/actions/auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Enter the secret key. This page is not linked from the public site.
      </p>
      <form action={loginWithSecret} className="mt-6 space-y-4">
        <label className="block text-sm font-medium">
          Secret key
          <input
            name="secret"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded border border-zinc-300 bg-white px-3 py-2"
          />
        </label>
        {error ? (
          <p className="text-sm text-red-600">That key did not match.</p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
        >
          Continue
        </button>
      </form>
    </main>
  );
}
