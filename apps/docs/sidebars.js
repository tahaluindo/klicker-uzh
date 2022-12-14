module.exports = {
  usecases: ['use_cases/live_qa', 'use_cases/real_time_feedback'],
  docs: {
    Introduction: ['introduction/getting_started', 'introduction/concepts'],
    Tutorial: [
      'basics/question_pool',
      'basics/question_create',
      'basics/session_create',
      'basics/navigation',
      'basics/session_list',
      'basics/session_running',
      'basics/audience_view',
      'basics/audience_interaction',
      'basics/evaluation',
    ],
    'Advanced Features': [
      'advanced/participant_authentication',
      'advanced/delete_account',
      'advanced/session_nonsequential',
      'advanced/question_archive',
      'advanced/session_countdown',
      'advanced/session_block_reset',
      'advanced/question_delete',
      'advanced/question_export',
      'advanced/question_edit',
      'advanced/question_statistics',
      'advanced/settings',
    ],
    Deployment: [
      'deployment/deployment_architecture',
      'deployment/deployment_requirements',
      'deployment/deployment_docker',
    ],
    Contributing: [
      'contributing/sponsoring',
      'contributing/contributing_guidelines',
      'contributing/contributing_setup',
    ],
    FAQ: ['faq/faq'],
  },
}
