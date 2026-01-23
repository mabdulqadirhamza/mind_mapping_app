import { RadarProvider } from '@/context/RadarContext';
import GrowthRadar from '@/components/radar/GrowthRadar';

const Index = () => {
  return (
    <RadarProvider>
      <GrowthRadar />
    </RadarProvider>
  );
};

export default Index;
