# DerivEdge / DerivAlchemist

Next.js 15 trading intelligence dashboard integrated with Deriv and Firebase.

## Deploying to Vercel via GitHub

1. **Push to GitHub**: Commit and push this repository to your GitHub repository.
2. **Import into Vercel**:
   - In Vercel, select **Add New -> Project** and import your GitHub repository.
   - Framework Preset: **Next.js** (configured via `vercel.json`).
   - Build Command: `npm run build` (`next build`).
   - Node.js Version: **20.x** or higher (`>=20.0.0` in `package.json`).
3. **Environment Variables** (Project Settings -> Environment Variables):
   - `GOOGLE_GENAI_API_KEY`: Your Google AI / Gemini API key for the Genkit tick anomaly advisor.
   - `DERIV_APP_ID` *(optional)*: Custom Deriv App ID.
   - `NEXT_PUBLIC_DERIV_REDIRECT_URI` *(optional)*: Custom OAuth callback URL (defaults to `<your-vercel-domain>/callback`).
4. **Post-Deploy Checklist**:
   - **Firebase Authentication**: Add your Vercel domain (e.g., `your-app.vercel.app`) to **Firebase Console -> Authentication -> Settings -> Authorized domains**.
   - **Deriv OAuth** *(if using OAuth login)*: Register `https://<your-vercel-domain>/callback` as an allowed redirect URI in your Deriv App settings.
