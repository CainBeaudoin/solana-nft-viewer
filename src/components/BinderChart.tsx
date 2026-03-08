import { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time, UTCTimestamp } from 'lightweight-charts';

interface ChartMarker {
  time: UTCTimestamp;
  position: 'aboveBar' | 'belowBar';
  color: string;
  shape: 'circle' | 'square' | 'arrowUp' | 'arrowDown';
  text: string;
  id: string;
  name: string;
  boundSupply: number;
  image: string;
}

interface BoundCollection {
  address: string;
  name: string;
  image: string;
  binderPerNft: number;
  currentSize: number;
  createdAt: number;
}

interface BinderChartProps {
  pairAddress: string;
  collections: BoundCollection[];
  onMarkerClick: (collection: BoundCollection) => void;
}

type TimeframeOption = '1m' | '5m' | '15m' | '1h' | '4h' | '1D';

const timeframeConfig: Record<TimeframeOption, { resolution: string; label: string; seconds: number }> = {
  '1m': { resolution: '1', label: '1m', seconds: 60 },
  '5m': { resolution: '5', label: '5m', seconds: 300 },
  '15m': { resolution: '15', label: '15m', seconds: 900 },
  '1h': { resolution: '60', label: '1H', seconds: 3600 },
  '4h': { resolution: '240', label: '4H', seconds: 14400 },
  '1D': { resolution: '1D', label: '1D', seconds: 86400 },
};

export function BinderChart({ pairAddress, collections, onMarkerClick }: BinderChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [timeframe, setTimeframe] = useState<TimeframeOption>('15m');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMarkers, setShowMarkers] = useState(true);
  const [hoveredMarker, setHoveredMarker] = useState<ChartMarker | null>(null);

  const fetchCandleData = useCallback(async (tf: TimeframeOption): Promise<CandlestickData[]> => {
    try {
      // Fetch from DexScreener API
      const response = await fetch(
        `https://api.dexscreener.com/latest/dex/pairs/solana/${pairAddress}`
      );
      const data = await response.json();

      if (!data.pair) {
        throw new Error('Pair not found');
      }

      // DexScreener doesn't provide historical OHLCV, so we'll use Birdeye
      const birdeyeResponse = await fetch(
        `https://public-api.birdeye.so/defi/ohlcv?address=${pairAddress}&type=${timeframeConfig[tf].resolution}m&time_from=${Math.floor(Date.now() / 1000) - 86400 * 30}&time_to=${Math.floor(Date.now() / 1000)}`,
        {
          headers: {
            'X-API-KEY': 'public' // Birdeye public tier
          }
        }
      );

      if (!birdeyeResponse.ok) {
        // Fallback: Generate mock data based on current price for demo
        const currentPrice = parseFloat(data.pair.priceUsd) || 0.00167;
        return generateMockCandles(currentPrice, tf);
      }

      const ohlcvData = await birdeyeResponse.json();

      if (ohlcvData.data?.items) {
        return ohlcvData.data.items.map((item: any) => ({
          time: item.unixTime as UTCTimestamp,
          open: item.o,
          high: item.h,
          low: item.l,
          close: item.c,
        }));
      }

      // Fallback to mock data
      const currentPrice = parseFloat(data.pair.priceUsd) || 0.00167;
      return generateMockCandles(currentPrice, tf);
    } catch (err) {
      console.error('Error fetching candle data:', err);
      // Return mock data on error
      return generateMockCandles(0.00167, tf);
    }
  }, [pairAddress]);

  // Generate realistic mock candle data
  const generateMockCandles = (basePrice: number, tf: TimeframeOption): CandlestickData[] => {
    const candles: CandlestickData[] = [];
    const now = Math.floor(Date.now() / 1000);
    const intervalSeconds = timeframeConfig[tf].seconds;
    const numCandles = 500;

    let price = basePrice * 0.5; // Start lower to show growth

    for (let i = numCandles; i >= 0; i--) {
      const time = (now - (i * intervalSeconds)) as UTCTimestamp;
      const volatility = 0.02 + Math.random() * 0.03;
      const trend = 0.0003; // Slight upward trend

      const open = price;
      const change = (Math.random() - 0.48) * volatility + trend;
      const close = open * (1 + change);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);

      candles.push({
        time,
        open,
        high,
        low,
        close,
      });

      price = close;
    }

    return candles;
  };

  // Create markers from collections
  const createMarkers = useCallback((candles: CandlestickData[]): ChartMarker[] => {
    if (!candles.length) return [];

    const minTime = candles[0].time as number;
    const maxTime = candles[candles.length - 1].time as number;

    return collections
      .filter(c => c.createdAt >= minTime && c.createdAt <= maxTime)
      .map((c, index) => ({
        time: c.createdAt as UTCTimestamp,
        position: index % 2 === 0 ? 'aboveBar' : 'belowBar' as const,
        color: '#9333ea',
        shape: 'circle' as const,
        text: c.name.slice(0, 3).toUpperCase(),
        id: c.address,
        name: c.name,
        boundSupply: c.currentSize * c.binderPerNft,
        image: c.image,
      }));
  }, [collections]);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#0d0d0d' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: '#1f1f1f' },
        horzLines: { color: '#1f1f1f' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#9333ea',
          width: 1,
          style: 2,
        },
        horzLine: {
          color: '#9333ea',
          width: 1,
          style: 2,
        },
      },
      rightPriceScale: {
        borderColor: '#2d2d2d',
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
      timeScale: {
        borderColor: '#2d2d2d',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: true,
      handleScale: true,
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Handle marker clicks via crosshair
    chart.subscribeCrosshairMove((param) => {
      if (param.time && candleSeriesRef.current) {
        const markers = candleSeriesRef.current.markers();
        const clickedMarker = markers.find(m => m.time === param.time);
        if (clickedMarker) {
          const collection = collections.find(c => c.createdAt === (clickedMarker.time as number));
          if (collection) {
            setHoveredMarker({
              time: clickedMarker.time as UTCTimestamp,
              position: 'aboveBar',
              color: '#9333ea',
              shape: 'circle',
              text: '',
              id: collection.address,
              name: collection.name,
              boundSupply: collection.currentSize * collection.binderPerNft,
              image: collection.image,
            });
          }
        } else {
          setHoveredMarker(null);
        }
      }
    });

    chart.subscribeClick((param) => {
      if (param.time && candleSeriesRef.current) {
        const markers = candleSeriesRef.current.markers();
        const clickedMarker = markers.find(m => m.time === param.time);
        if (clickedMarker) {
          const collection = collections.find(c => c.createdAt === (clickedMarker.time as number));
          if (collection) {
            onMarkerClick(collection);
          }
        }
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [collections, onMarkerClick]);

  // Load data when timeframe changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const candles = await fetchCandleData(timeframe);

        if (candleSeriesRef.current && candles.length > 0) {
          candleSeriesRef.current.setData(candles);

          // Add markers if enabled
          if (showMarkers) {
            const markers = createMarkers(candles);
            candleSeriesRef.current.setMarkers(
              markers.map(m => ({
                time: m.time,
                position: m.position,
                color: m.color,
                shape: m.shape,
                text: m.text,
              }))
            );
          } else {
            candleSeriesRef.current.setMarkers([]);
          }

          // Fit content
          chartRef.current?.timeScale().fitContent();
        }
      } catch (err) {
        setError('Failed to load chart data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [timeframe, fetchCandleData, createMarkers, showMarkers]);

  // Update markers when toggle changes
  useEffect(() => {
    const updateMarkers = async () => {
      if (!candleSeriesRef.current) return;

      if (showMarkers) {
        const candles = await fetchCandleData(timeframe);
        const markers = createMarkers(candles);
        candleSeriesRef.current.setMarkers(
          markers.map(m => ({
            time: m.time,
            position: m.position,
            color: m.color,
            shape: m.shape,
            text: m.text,
          }))
        );
      } else {
        candleSeriesRef.current.setMarkers([]);
      }
    };

    updateMarkers();
  }, [showMarkers, timeframe, fetchCandleData, createMarkers]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <div className="relative w-full h-full">
      {/* Chart Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-dark-surface/90 backdrop-blur-sm border-b border-dark-border">
        {/* Timeframe Selector */}
        <div className="flex items-center gap-1">
          {(Object.keys(timeframeConfig) as TimeframeOption[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                timeframe === tf
                  ? 'bg-accent-purple text-white'
                  : 'text-gray-400 hover:text-white hover:bg-dark-hover'
              }`}
            >
              {timeframeConfig[tf].label}
            </button>
          ))}
        </div>

        {/* Markers Toggle */}
        <button
          onClick={() => setShowMarkers(!showMarkers)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            showMarkers
              ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/50'
              : 'bg-dark-card text-gray-400 hover:text-white border border-dark-border'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Collections
        </button>
      </div>

      {/* Chart Container */}
      <div
        ref={chartContainerRef}
        className="w-full h-full pt-12"
        style={{ minHeight: '400px' }}
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-bg/80">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 animate-spin text-accent-purple" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm text-gray-400">Loading chart...</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-16 left-4 right-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Hovered Marker Tooltip */}
      {hoveredMarker && (
        <div className="absolute top-16 right-4 z-20 p-3 bg-dark-bg border border-accent-purple/50 rounded-lg shadow-xl min-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={hoveredMarker.image}
              alt=""
              className="w-8 h-8 rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div>
              <p className="text-sm font-medium text-white">{hoveredMarker.name}</p>
              <p className="text-xs text-gray-500">
                {new Date(hoveredMarker.time * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="text-xs text-accent-purple">
            Bound: {formatNumber(hoveredMarker.boundSupply)} BINDER
          </div>
          <p className="text-xs text-gray-500 mt-1">Click marker to view details</p>
        </div>
      )}

      {/* Legend */}
      {showMarkers && (
        <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 bg-dark-bg/90 border border-dark-border rounded-lg">
          <div className="w-3 h-3 rounded-full bg-accent-purple" />
          <span className="text-xs text-gray-400">Collection Created</span>
        </div>
      )}
    </div>
  );
}
