import Report from '../models/Report.js';

export async function createReport(data) {
  return Report.create(data);
}

export async function getReportById(reportId) {
  return Report.findById(reportId)
    .populate('reporter', 'username avatar')
    .populate('targetUser', 'username avatar')
    .populate('targetPost', 'title content');
}

export async function getAllReports(skip = 0, limit = 20, status = null) {
  const query = status ? { status } : {};
  return Report.find(query)
    .populate('reporter', 'username avatar')
    .populate('targetUser', 'username avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
}

export async function updateReportStatus(reportId, status, adminNotes) {
  return Report.findByIdAndUpdate(
    reportId,
    { status, adminNotes, reviewedAt: new Date() },
    { new: true }
  );
}

export async function deleteReport(reportId) {
  return Report.findByIdAndDelete(reportId);
}

export async function getPendingReports(limit = 10) {
  return Report.find({ status: 'pending' })
    .sort({ createdAt: 1 })
    .limit(limit)
    .populate('reporter', 'username avatar')
    .populate('targetUser', 'username avatar');
}
