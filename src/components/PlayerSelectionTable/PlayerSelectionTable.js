import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';

import { UserTableCell } from 'components';

const useStyles = makeStyles(theme => ({
  root: {},
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
}));

const PlayerSelectionTable = props => {
  const { playersIds, setPlayersIds, users } = props;
  const classes = useStyles();

  const handleSelectAll = event => {
    let playersIds;

    if (event.target.checked) {
      playersIds = users.map(user => user.id);
    } else {
      playersIds = [];
    }

    setPlayersIds(playersIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = playersIds.indexOf(id);
    let newSelectedUsers = [];

    if (selectedIndex === -1) {
      newSelectedUsers = newSelectedUsers.concat(playersIds, id);
    } else if (selectedIndex === 0) {
      newSelectedUsers = newSelectedUsers.concat(playersIds.slice(1));
    } else if (selectedIndex === playersIds.length - 1) {
      newSelectedUsers = newSelectedUsers.concat(playersIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUsers = newSelectedUsers.concat(
        playersIds.slice(0, selectedIndex),
        playersIds.slice(selectedIndex + 1)
      );
    }

    setPlayersIds(newSelectedUsers);
  };

  return (
    <PerfectScrollbar>
      <div className={classes.inner}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={playersIds.length === users.length}
                  color="primary"
                  indeterminate={
                    playersIds.length > 0 &&
                    playersIds.length < users.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Data do cadastro</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow
                className={classes.tableRow}
                hover
                key={user.id}
                selected={playersIds.indexOf(user.id) !== -1}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={playersIds.indexOf(user.id) !== -1}
                    color="primary"
                    onChange={event => handleSelectOne(event, user.id)}
                    value="true"
                  />
                </TableCell>
                <UserTableCell 
                  image={user.image} 
                  name={user.name} 
                />
                <TableCell>
                  {moment(user.createdAt).format('DD/MM/YYYY')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PerfectScrollbar>
  );
};

PlayerSelectionTable.propTypes = {
  playersIds: PropTypes.array.isRequired,
  setPlayersIds: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.avatarUrl,
    createdAt: PropTypes.string.isRequired,
  })),
};

export default PlayerSelectionTable;
