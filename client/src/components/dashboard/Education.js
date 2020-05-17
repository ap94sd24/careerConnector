import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { deleteEducation } from '../../actions/profile';
import { connect } from 'react-redux';

const Education = ({ education, deleteEducation }) => {
  const educations = education.map((e) => (
    <tr key={e._id}>
      <td>{e.school}</td>
      <td className='hide-sm'>{e.degree}</td>
      <td className='hide-sm'>{e.fieldOfStudy}</td>
      <td>
        <Moment format='YYYY/MM/DD'>{e.from}</Moment> -{' '}
        {e.to === null ? (
          ' Current'
        ) : (
          <Moment format='YYYY/MM/DD'>{e.to}</Moment>
        )}
      </td>
      <td>
        <button
          onClick={() => deleteEducation(e._id)}
          className='btn btn-danger'
        >
          Delete
        </button>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <h2 className='my-2'>Education Background</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>School</th>
            <th className='hide-sm'>Degree</th>
            <th className='hide-sm'>Field Of Study</th>
            <th className='hide-sm'>Years</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{educations}</tbody>
      </table>
    </Fragment>
  );
};

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired,
};

export default connect(null, { deleteEducation })(Education);
