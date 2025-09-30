'use client';
import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { formatPrice } from '@/lib/formatPrice';

// Tailwind-Inspired Design Tokens for React-PDF
const colors = {
  white: '#FFFFFF',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  }
};

const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  15: 60,
  20: 80,
  25: 100,
  30: 120,
};

const borderRadius = {
  none: 0,
  sm: 2,
  DEFAULT: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
};

const fontSize = {
  xs: 9,
  sm: 10,
  base: 11,
  lg: 13,
  xl: 16,
  '2xl': 18,
  '3xl': 24,
  '4xl': 32,
};

// Professional PDF Styles using Tailwind Design Tokens
const styles = StyleSheet.create({
  // Main Page Layout
  page: {
    flexDirection: 'column',
    backgroundColor: colors.white,
    padding: spacing[8],
    fontFamily: 'Helvetica',
    fontSize: fontSize.xs,
    lineHeight: 1.4,
  },

  // Header Component
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[6],
    backgroundColor: colors.slate[50],
    padding: spacing[5],
    borderRadius: borderRadius.lg,
    borderLeftWidth: 5,
    borderLeftColor: colors.blue[600],
  },

  companyInfo: {
    flexDirection: 'column',
  },

  companyName: {
    fontSize: fontSize['3xl'],
    fontWeight: 'bold',
    color: colors.blue[600],
    marginBottom: spacing[1],
  },

  companyTagline: {
    fontSize: fontSize.sm,
    color: colors.slate[600],
    fontStyle: 'italic',
  },

  invoiceInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    backgroundColor: colors.blue[600],
    padding: spacing[3],
    borderRadius: borderRadius.md,
  },

  invoiceTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: spacing[1],
  },

  invoiceNumber: {
    fontSize: fontSize.sm,
    color: colors.blue[200],
  },

  // Info Section
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[6],
    gap: spacing[5],
  },

  infoCard: {
    flex: 1,
    backgroundColor: colors.slate[100],
    padding: spacing[4],
    borderRadius: borderRadius.md,
    borderTopWidth: 3,
    borderTopColor: colors.blue[500],
  },

  infoTitle: {
    fontSize: fontSize.base,
    fontWeight: 'bold',
    color: colors.slate[800],
    marginBottom: spacing[2],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  customerName: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.slate[800],
    marginBottom: spacing[1],
  },

  infoText: {
    fontSize: fontSize.sm,
    color: colors.slate[600],
    marginBottom: spacing[1],
  },

  // Course Section
  courseSection: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    marginBottom: spacing[5],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  courseSectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.slate[800],
    marginBottom: spacing[4],
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  courseCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[4],
  },

  courseImagePlaceholder: {
    width: spacing[20],
    height: spacing[15],
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.md,
    flexShrink: 0,
  },

  courseDetails: {
    flex: 1,
  },

  courseName: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.slate[800],
    marginBottom: spacing[1],
  },

  courseSubtitle: {
    fontSize: fontSize.base,
    color: colors.slate[600],
    marginBottom: spacing[1],
    fontStyle: 'italic',
  },

  courseInfo: {
    fontSize: fontSize.xs,
    color: colors.slate[600],
    marginBottom: spacing[1],
  },

  priceCard: {
    backgroundColor: colors.blue[600],
    padding: spacing[3],
    borderRadius: borderRadius.md,
    alignItems: 'center',
    minWidth: spacing[25],
  },

  priceLabel: {
    fontSize: fontSize.xs,
    color: colors.blue[200],
    marginBottom: spacing[1],
  },

  priceAmount: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.white,
  },

  // Summary Section
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[5],
    gap: spacing[4],
  },

  summaryCard: {
    flex: 1,
    backgroundColor: colors.slate[50],
    padding: spacing[3],
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.green[600],
  },

  summaryTitle: {
    fontSize: fontSize.sm,
    fontWeight: 'bold',
    color: colors.green[800],
    marginBottom: spacing[2],
    textTransform: 'uppercase',
  },

  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[1],
  },

  summaryLabel: {
    fontSize: fontSize.xs,
    color: colors.gray[700],
  },

  summaryValue: {
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    color: colors.gray[700],
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.gray[300],
    paddingTop: spacing[2],
    marginTop: spacing[2],
  },

  totalLabel: {
    fontSize: fontSize.base,
    fontWeight: 'bold',
    color: colors.green[700],
  },

  totalAmount: {
    fontSize: fontSize.base,
    fontWeight: 'bold',
    color: colors.green[700],
  },

  // Payment Badge
  paymentBadge: {
    backgroundColor: colors.green[100],
    borderWidth: 1,
    borderColor: colors.green[600],
    padding: spacing[3],
    borderRadius: borderRadius.full,
    alignItems: 'center',
    marginBottom: spacing[5],
  },

  paymentBadgeText: {
    fontSize: fontSize.base,
    fontWeight: 'bold',
    color: colors.green[700],
  },

  paymentDetails: {
    fontSize: fontSize.xs,
    color: colors.green[800],
    textAlign: 'center',
  },

  // Footer
  footer: {
    marginTop: spacing[5],
    paddingTop: spacing[4],
    borderTopWidth: 2,
    borderTopColor: colors.gray[200],
    alignItems: 'center',
    backgroundColor: colors.slate[50],
    padding: spacing[4],
    borderRadius: borderRadius.md,
  },

  footerTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.blue[600],
    marginBottom: spacing[1],
  },

  footerText: {
    fontSize: fontSize.xs,
    color: colors.slate[600],
    textAlign: 'center',
    marginBottom: spacing[1],
  },
});

// Invoice Document Component - Single Page Optimized
const InvoiceDocument = ({ courseData, paymentData, userData }) => {
  const invoiceNumber = paymentData?.paymentIntentId?.slice(-8) || `FREE${Date.now().toString().slice(-6)}`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>EduConnect</Text>
            <Text style={styles.companyTagline}>Professional Learning Platform</Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceTitle}>Invoice</Text>
            <Text style={styles.invoiceNumber}>#{invoiceNumber}</Text>
          </View>
        </View>

        {/* Student & Payment Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Student Information</Text>
            <Text style={styles.customerName}>{userData?.name || 'Student Name'}</Text>
            <Text style={styles.infoText}>{userData?.email || 'student@example.com'}</Text>
            {userData?.phone && <Text style={styles.infoText}>{userData.phone}</Text>}
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Payment Details</Text>
            <Text style={styles.infoText}>Date: {currentDate}</Text>
            <Text style={styles.infoText}>
              Method: {paymentData?.isFree ? 'Free Course' : 'Credit Card'}
            </Text>
            <Text style={styles.infoText}>Status: Confirmed</Text>
          </View>
        </View>

        {/* Course Section */}
        <View style={styles.courseSection}>
          <Text style={styles.courseSectionTitle}>Course Details</Text>
          <View style={styles.courseCard}>
            <View style={styles.courseImagePlaceholder} />
            <View style={styles.courseDetails}>
              <Text style={styles.courseName}>{courseData?.title || 'Course Title'}</Text>
              {courseData?.subtitle && (
                <Text style={styles.courseSubtitle}>{courseData.subtitle}</Text>
              )}
              <Text style={styles.courseInfo}>
                Instructor: {courseData?.instructor?.firstName} {courseData?.instructor?.lastName}
              </Text>
              <Text style={styles.courseInfo}>
                Category: {courseData?.category?.title || 'Professional'}
              </Text>
              {courseData?.modules && (
                <Text style={styles.courseInfo}>
                  Modules: {courseData.modules.length}
                </Text>
              )}
            </View>
            <View style={styles.priceCard}>
              <Text style={styles.priceLabel}>Total</Text>
              <Text style={styles.priceAmount}>{formatPrice(courseData?.price)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Payment Summary</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Course Price:</Text>
              <Text style={styles.summaryValue}>{formatPrice(courseData?.price)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Discount:</Text>
              <Text style={styles.summaryValue}>$0.00</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tax:</Text>
              <Text style={styles.summaryValue}>$0.00</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalAmount}>{formatPrice(courseData?.price)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Status Badge */}
        <View style={styles.paymentBadge}>
          <Text style={styles.paymentBadgeText}>✓ Payment Confirmed</Text>
          <Text style={styles.paymentDetails}>
            {paymentData?.isFree ? 'Free enrollment completed' : 'Payment processed successfully'}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Thank you for choosing EduConnect!</Text>
          <Text style={styles.footerText}>Start learning immediately with lifetime access</Text>
          <Text style={styles.footerText}>Contact support: support@educonnect.com</Text>
        </View>
      </Page>
    </Document>
  );
};

// Main Invoice Component with Download Button
export function ReactPDFInvoice({ courseData, paymentData, userData }) {
  const invoiceNumber = paymentData?.paymentIntentId?.slice(-8) || `FREE${Date.now().toString().slice(-6)}`;
  
  return (
    <PDFDownloadLink
      document={
        <InvoiceDocument 
          courseData={courseData} 
          paymentData={paymentData} 
          userData={userData} 
        />
      }
      fileName={`EduConnect-Invoice-${invoiceNumber}.pdf`}
      className="group inline-flex items-center justify-center w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      {({ blob, url, loading, error }) => (
        loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Generating PDF...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Professional Invoice</span>
            <span className="ml-2 text-sm opacity-90 bg-white/20 px-2 py-1 rounded">#{invoiceNumber}</span>
          </>
        )
      )}
    </PDFDownloadLink>
  );
}

// Invoice Preview Component for UI - Modern Tailwind Design
export function ReactPDFInvoicePreview({ courseData, paymentData, userData, className = "" }) {
  const invoiceNumber = paymentData?.paymentIntentId?.slice(-8) || `FREE${Date.now().toString().slice(-6)}`;
  
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-gray-200 shadow-xl ${className}`}>
      {/* Header with Gradient */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold">EduConnect</h3>
            <p className="text-blue-100 text-sm">Professional Learning Platform</p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
              <p className="text-xs text-blue-100">Invoice</p>
              <p className="font-bold">#{invoiceNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 space-y-6">
        {/* Course Info Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-4 py-3 border-b border-gray-100">
            <h4 className="font-semibold text-gray-800 text-sm flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Course Details
            </h4>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h5 className="font-bold text-gray-900 text-base leading-tight">
                  {courseData?.title || 'Course Title'}
                </h5>
                {courseData?.subtitle && (
                  <p className="text-gray-600 text-sm mt-1">{courseData.subtitle}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {courseData?.instructor?.firstName} {courseData?.instructor?.lastName}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {courseData?.category?.title || 'Professional'}
                  </span>
                  {courseData?.modules && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {courseData.modules.length} modules
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-4 text-right">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg px-3 py-2">
                  <p className="text-xs opacity-90">Total</p>
                  <p className="text-lg font-bold">{formatPrice(courseData?.price)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Student & Payment Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Student Info */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <h5 className="font-semibold text-gray-800 text-sm mb-3 flex items-center">
              <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs">👤</span>
              </span>
              Student Information
            </h5>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-gray-900">{userData?.name || 'Student'}</p>
              <p className="text-gray-600">{userData?.email || 'student@example.com'}</p>
              {userData?.phone && <p className="text-gray-600">{userData.phone}</p>}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <h5 className="font-semibold text-gray-800 text-sm mb-3 flex items-center">
              <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs">💳</span>
              </span>
              Payment Details
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Method:</span>
                <span className="font-medium">
                  {paymentData?.isFree ? 'Free Course' : 'Credit Card'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                  ✓ Confirmed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="pt-2">
          <ReactPDFInvoice 
            courseData={courseData} 
            paymentData={paymentData} 
            userData={userData} 
          />
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-xs text-gray-500 bg-gray-50 rounded-lg py-2 px-4 inline-block">
            🎓 Professional PDF invoice • All transaction details included • Print-ready format
          </p>
        </div>
      </div>
    </div>
  );
}

// Default export
export default ReactPDFInvoice;