import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(to bottom right, #0f172a, #020617)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
            }}
          >
            <span
              style={{
                backgroundImage: 'linear-gradient(to right, #10b981, #14b8a6)',
                backgroundClip: 'text',
                color: 'transparent',
                fontSize: 80,
                fontFamily: 'Playfair Display, serif',
                fontWeight: '800',
                marginBottom: 16,
              }}
            >
              Use AI Tools
            </span>
          </div>
          <p
            style={{
              fontSize: 36,
              fontFamily: 'Inter, sans-serif',
              color: '#94a3b8',
              marginTop: 0,
              fontWeight: '300',
            }}
          >
            Discover 50+ Best AI Tools
          </p>
          <div
            style={{
              marginTop: 40,
              height: 3,
              width: 200,
              backgroundImage: 'linear-gradient(to right, #10b981, #14b8a6)',
              borderRadius: '9999px',
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
