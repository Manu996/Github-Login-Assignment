import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  FlatList,
} from 'react-native';
import axios from 'axios';
import {
  fontSize,
  fonts,
  colors,
  spacing,
  scales,
} from '../../constants/appStyles';
import {useUserInfo} from '../../contexts/userInfo';
import Environment from '../../config/environment';
import Header from '../../components/Header';
import Loader from '../../components/Loader';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

const getDateFormat = date => {
  const d = new Date(date.split('T')[0]);
  const day = d.getDate();
  const year = d.getFullYear();
  const dateFormat = `${day} ${months[d.getMonth()]} ${year}`;
  return dateFormat;
};

const pageSize = 5;
let currentPage = 1;

const Repos = props => {
  const {navigation} = props;
  const {accessToken} = useUserInfo();
  const [reposList, setReposList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRepoData(1);
  }, []);

  const getRepoData = pageNumber => {
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    axios
      .get(
        `${Environment.API_BASE_URL}user/repos?page=${pageNumber}&per_page=${pageSize}`,
        {
          headers: headers,
        },
      )
      .then(response => {
        setReposList(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const ListItem = ({item}) => {
    return (
      <View style={styles.listItem}>
        <Text style={styles.repoName}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.description}>
          Created at: {getDateFormat(item.created_at)}
        </Text>
        <View style={styles.privateTag}>
          <Text style={styles.privateText}>
            {item.private ? 'Private' : 'Public'}
          </Text>
        </View>
      </View>
    );
  };

  const onPressPrevious = currPage => {
    currentPage = currPage - 1;
    getRepoData(currentPage);
  };

  const onPressNext = currPage => {
    currentPage = currPage + 1;
    getRepoData(currentPage);
  };

  const renderFooter = () => {
    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          disabled={currentPage === 1}
          onPress={() => {
            onPressPrevious(currentPage);
          }}
          style={
            currentPage > 1 ? styles.paginationButton : styles.disabledButton
          }>
          <Text style={styles.paginationButtonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={reposList.length < pageSize}
          onPress={() => {
            onPressNext(currentPage);
          }}
          style={
            reposList.length === pageSize
              ? styles.paginationButton
              : styles.disabledButton
          }>
          <Text style={styles.paginationButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const EmptyListComponent = () => {
    return (
      <View>
        <Text>No Data</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Repos" onBackPress={() => navigation.goBack()} />
      <View style={styles.reposListContainer}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <Loader color={colors.primary} />
          </View>
        ) : (
          <FlatList
            keyExtractor={item => item.id}
            data={reposList}
            renderItem={({item}) => <ListItem item={item} />}
            ListEmptyComponent={EmptyListComponent}
            ListFooterComponent={renderFooter}
            ListFooterComponentStyle={styles.footerContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  reposListContainer: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
  },
  listItem: {
    height: 80,
    width: '100%',
    marginTop: spacing(15),
    borderBottomWidth: scales(1),
    borderColor: colors.greyBlue,
  },
  repoName: {
    fontSize: fontSize(18),
    color: colors.primary,
    fontWeight: '500',
  },
  description: {
    fontSize: fontSize(13),
    marginTop: spacing(3),
    color: colors.greyBlue,
  },
  privateTag: {
    position: 'absolute',
    right: spacing(5),
    top: spacing(5),
    height: scales(20),
    width: scales(70),
    backgroundColor: 'gray',
    borderRadius: scales(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  privateText: {
    fontSize: fontSize(12),
    color: colors.white,
  },
  footerContainer: {
    justifyContent: 'flex-end',
    marginTop: spacing(10),
  },
  paginationButton: {
    backgroundColor: colors.primary,
    height: scales(40),
    width: scales(80),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scales(8),
  },
  paginationButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#646870',
    height: scales(40),
    width: scales(80),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scales(8),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing(10),
    flex: 1,
  },
});

export default Repos;
