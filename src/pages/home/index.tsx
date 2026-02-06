import Loading from "@/layout/loading";
import { getHomeData } from "@/services/home";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import ScheduleCard from "./schedule-card";
import { DoctorScheduleGrouped, formatDataList } from "@/utils";
import logger from "@/utils/logger";



const Home = () => {
  const [doctorSchedule, setDoctorSchedule] = useState<DoctorScheduleGrouped[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    queryData(false);
  }, []);

  const queryData = async (isRefreshing: boolean) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const data = await getHomeData();
      const formattedData = formatDataList(data);
      setDoctorSchedule(formattedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  logger.l(doctorSchedule);

  return loading ? (
    <Loading />
  ) : (
    <FlatList
      data={doctorSchedule}
      renderItem={({ item }) => <ScheduleCard {...item} />}
      keyExtractor={(item, index) => `${item.name}-${index}` }
      refreshing={refreshing}
      onRefresh={() => queryData(true)}
    />
  );

}

export default Home; 