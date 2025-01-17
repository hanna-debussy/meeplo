import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { theme } from '../../assets/constant/DesignTheme';
import StepTextInput from '../../components/common/StepTextInput';
import DateModalInput from '../../components/schedule/DateModalInput';
import KeywordsModalInput from '../../components/schedule/KeywordsModalInput';
import MapLocationInput from '../../components/map/MapLocationInput';
import GroupMemberSelectList from '../../components/Group/GroupMemberSelectList';
import { hideTabBar, showTabBar } from '../../redux/navigationSlice';
import { useFocusEffect } from '@react-navigation/native';
import LoadingModal from '../../components/common/LoadingModal';
import { useEffect } from 'react';
import { editSchedule } from '../../redux/scheduleSlice';
import { getGroupMembers } from '../../redux/groupSlice';

const { width } = Dimensions.get('window');

const ScheduleEditScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();

  const schedule = useSelector(state => state?.schedule?.schedule);
  const groupMemberList = useSelector(state => {
    if (!state || !state.group || !Array.isArray(state.group.members)) return [];
    return state.group.members;
  });

  const [scheduleName, setScheduleName] = useState(schedule?.name);
  const [scheduleDate, setScheduleDate] = useState(schedule?.date);
  const [scheduleKeywords, setScheduleKeywords] = useState(schedule?.keywords);
  const [scheduleMeetLocation, setScheduleMeetLocation] = useState(schedule?.meetLocation);
  const [scheduleAmuseLocation, setScheduleAmuseLocation] = useState(schedule?.amuseLocation?.[0]);
  const [selectedMembers, setSelectedMembers] = useState(schedule?.members);
  const userInfo = useSelector(state => state.user.info);

  const scheduleId = route?.params?.scheduleId;
  const isLoading = false;

  const onConfirmDate = confirmedDate => {
    setScheduleDate(confirmedDate);
  };

  const onSelectMember = member => {
    if (selectedMembers.find(m => m.id === member.id)) {
      setSelectedMembers(selectedMembers.filter(m => m.id !== member.id));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const onPressEdit = () => {
    const form = {
      id: scheduleId,
      date: scheduleDate,
      name: scheduleName,
      groupId: schedule.group.id,
      keywords: scheduleKeywords,
      meetLocationId: scheduleMeetLocation.id,
      members: selectedMembers.map(mem => {
        return { id: mem.id };
      }),
      amuses: scheduleAmuseLocation ? [{ id: scheduleAmuseLocation?.id }] : [],
    };
    dispatch(editSchedule({ form, scheduleId, Alert, navigation }));
  };

  useEffect(() => {
    dispatch(getGroupMembers({ groupId: schedule?.group?.id }));
  }, []);

  useFocusEffect(() => {
    dispatch(hideTabBar());

    return () => {
      dispatch(showTabBar());
    };
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ margin: 20 }}>
          <Text style={{ color: theme.font.color, fontWeight: 'bold', marginVertical: 20 }}>
            그룹<Text style={{ color: theme.color.alert }}> *</Text>
          </Text>
          <Text style={{ color: 'black' }}>{schedule?.group?.name}</Text>
        </View>
        <View style={{ margin: 20 }}>
          <DateModalInput type="일시" value={scheduleDate} required onConfirm={onConfirmDate} />
        </View>
        <View style={{ margin: 20 }}>
          <StepTextInput
            type="약속 이름"
            maxLength={20}
            required={true}
            onValueChange={setScheduleName}
            value={scheduleName}
            multiline={false}
          />
        </View>
        <View style={{ margin: 20 }}>
          <KeywordsModalInput type="키워드" value={scheduleKeywords} onConfirm={setScheduleKeywords} />
        </View>
        <View style={{ margin: 20 }}>
          <MapLocationInput type="만날 장소" value={scheduleMeetLocation} onValueChange={setScheduleMeetLocation} />
        </View>
        <View style={{ margin: 20 }}>
          <MapLocationInput type="약속 장소" value={scheduleAmuseLocation} onValueChange={setScheduleAmuseLocation} />
        </View>
        <View style={{ margin: 20 }}>
          <GroupMemberSelectList
            type="그룹 멤버 초대"
            members={groupMemberList}
            selectedMembers={selectedMembers}
            user={userInfo}
            required
            onSelect={onSelectMember}
            isView={true}
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        style={{
          alignItems: 'center',
          width,
          justifyContent: 'center',
          height: 70,
        }}
        activeOpacity={0.6}
        onPress={onPressEdit}>
        <Text style={{ color: theme.color.alert, fontSize: 20, fontWeight: 'bold' }}>수정하기</Text>
      </TouchableOpacity>
      <LoadingModal visible={isLoading} />
    </SafeAreaView>
  );
};

export default ScheduleEditScreen;
